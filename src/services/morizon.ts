import { baseURL } from "../constants/config";
import { Scraper } from "./_";
import { IProperty, MorizonSettings, WhichScraperFrom } from "../constants/interfaces";
import { CsvHelper } from "../helpers/csvHelper";
import { Logger } from "../helpers/loggerHelper";

export class Morizon extends Scraper { 
    private saleExtendedUrl : string = baseURL.MORIZON.url;
    private rentExtendedUrl : string = baseURL.MORIZON.url+'/do-wynajecia';
    private propertyUrl : string = baseURL.MORIZON.url+'/oferta/';
    private searchSettings : MorizonSettings;
    private pageCount: number = 0;
    private url: string = '';
    private properties: Array<string> = [];

    constructor(settings: MorizonSettings) {
        super();
        this.searchSettings = settings;
    }

    private logHelper = new Logger(baseURL.MORIZON.name as string);
    private excelHelper = new CsvHelper();

    public async initScrape() {
        try{
            const { city, propertyType, type, areaHigh, areaLow, priceHigh, priceLow } = this.searchSettings;
            this.url = `${type === 'sale' ? this.saleExtendedUrl : this.rentExtendedUrl}${propertyType == 'domy' ? '/domy/' : '/mieszkania/'}${city}?${areaLow ? 'ps%5Bliving_area_from%5D='+areaLow : ''}&${areaHigh ? 'ps%5Bliving_area_to%5D='+areaHigh : ''}&${priceLow ? 'ps%5Bprice_from%5D='+priceLow : ''}&${priceHigh ? 'ps%5Bprice_to%5D='+priceHigh : ''}`
            this.logHelper.log(`========== STARTING SCRAPING SCOPE: ${this.url} =============`, "log")
            console.log(this.url)
            await this.launchBrowser({headless: "new"});
            const pageCount = await this.getLastElementTextFromClass(this.url, "pagination__item");
            await this.closeBrowser();
            this.pageCount = Number(pageCount);
            // this.runScrapeProperties();
            this.runScrapeProperty();
        } catch(error) {
            this.logHelper.log(error as string, "error");
        }
    }

    private async runScrapeProperties() {
        try{
            await this.launchBrowser({headless: "new"});
            for(let i=1; i<=this.pageCount; i++) {
            // for(let i=1; i<=1; i++) {
                this.logHelper.log(`Fetching OTODOM properties, current progress: ${i}/${this.pageCount} sites`, "log")
                const regex = /<a[^>]+href="([^"]+)"[^>]+class="offer__outer"[^>]*>/g;
                const html : string = await this.fetchHtmlWithPuppeteer(`${this.url}?page=${i}`);
                const matches : Array<string> = [...html.matchAll(regex)].map(match => match[1]);
                matches.forEach(el => this.properties.push(`${baseURL.MORIZON.url}${el}`));
            }
            await this.closeBrowser();
            this.runScrapeProperty(this.properties);
        } catch(error) {
            this.logHelper.log(error as string, "error");
        }
    }

    private async runScrapeProperty(properties? : Array<string>) {
        try{
            let property = [`https://www.morizon.pl/oferta/wynajem-mieszkanie-wroclaw-srodmiescie-jana-matejki-33m2-mzn2041951482`];
            // let property = this.properties;
            this.excelHelper.addHeaderRow();
            await this.launchBrowser({headless: "new"});
            let propertyCounter: number = 0;
            // for(const propertyData of properties) {
            for(const propertyData of property) {
                propertyCounter++;
                this.logHelper.log(`Scraping progress: ${Math.ceil(propertyCounter/(36*this.pageCount)*100)}%`, "log")
                const html = await this.fetchHtmlWithPuppeteer(propertyData);

                // Scraper name
                this.Property.scraper = baseURL.MORIZON.name as WhichScraperFrom;
    
                // Property type
                this.Property.type = this.searchSettings.propertyType === "domy" ? 'dom' : 'mieszkanie' || "unknown";
    
                // Street 
                const streetMatch = html.match(/<span class="main-location".*?>([\s\S]*?)<\/span>/);
                if(/<span class="main-location".*?>([\s\S]*?)<\/span>/.test(html) && streetMatch !== null && streetMatch[1]) {
                    this.Property.street = streetMatch[1].trim() || "unknown";
                }
    
                // Phone number
                const phoneNumberMatch = html.match(/tel:\b(?:\d+\s*)+\b/);
                if(/tel:\b(?:\d+\s*)+\b/.test(html) && phoneNumberMatch !== null) {
                    // console.log(phoneNumberMatch)
                    this.Property.phoneNumber = phoneNumberMatch[0].replaceAll(/\s/g, '').slice(4) || "unknown";
                }
    
                // City
                const cityMatch = html.match(/<span [^>]*[^>]*>\s*(.*?)\s*,\s*<\/span>/);
                if(/<span [^>]*>\s*(.*?)\s*,\s*<\/span>/.test(html) && cityMatch !== null && cityMatch[1]) {
                    this.Property.city = cityMatch[1].trim() || "unknown";
                }
    
                // Area
                const areaMatch = html.match(/(\d+(?:,\d+)?)\s*m(?:²|²?|<sup[^>]*>\s*2\s*<\/sup>)/);
                if(/(\d+(?:,\d+)?)\s*m(?:²|²?|<sup[^>]*>\s*2\s*<\/sup>)/.test(html) && areaMatch !== null && areaMatch[1]) {
                    this.Property.area = Number(areaMatch[1].replaceAll(/\s/g, '')) || 0;
                }
    
                // Price
                const priceMatch = html.match(/\s*([\d\s]+)\s*zł\s*/);
                if(/(\d+)\s*zł/.test(html) && priceMatch !== null && priceMatch[1]) {
                    this.Property.fullPrice = Number(priceMatch[1].replaceAll(/\s/g, '')) || 0;
                }
    
                // Price for metre
                const priceForMetreMatch = html.match(/(\b(?:\d+\s*)+\b) (?:zł\/m²)/);
                if(/(\b(?:\d+\s*)+\b) (?:zł\/m²)/.test(html) && priceForMetreMatch !== null && priceForMetreMatch[1]) {
                    this.Property.priceForMetre = Number(priceForMetreMatch[1].replaceAll(/\s/g, '')) || 0;
                }
    
                // Price for metre
                const ownerNameMatch = html.match(/<span[^>]*class="(?:contact-person__name|contact-company__name contact-company__name--development)"[^>]*>([^<]*)<\/span>/);
                if(/<span[^>]*class="(?:contact-person__name|contact-company__name contact-company__name--development)"[^>]*>([^<]*)<\/span>/.test(html) && ownerNameMatch !== null) {
                    // console.log(ownerNameMatch)
                    this.Property.ownerName = ownerNameMatch[1].trim() || "unknown";
                }
    
                // Owner type
                const ownerType = html.match(/<(?:span|div)[^>]*class="(?:contact-person__position|contact-company__type)"[^>]*>([^<]*)<\/(?:span|div)/);
                if(/<(?:span|div)[^>]*class="(?:contact-person__position|contact-company__type)"[^>]*>([^<]*)<\/(?:span|div)/.test(html) && ownerType !== null && ownerType[1]) {
                    this.Property.ownerType = ownerType[1].trim() == 'osoba prywatna' ? 'private' : 'developer' || "unknown";
                }
    
                // URL
                this.Property.urlToProperty = propertyData;
                this.excelHelper.addPropertyRow(this.Property.propertyData as IProperty)
                await this.excelHelper.saveExcelFile(this.Property.scraper as string);
            }
            await this.closeBrowser();
        } catch(error) {
            this.logHelper.log(error as string, "error");
        }

        
    }
    public async rescrapePropertiesFromExcel() {
        try {
            const dataToRescrape = await this.excelHelper.readExcelFile(baseURL.MORIZON.name, {cell: 'M'});
            console.log(dataToRescrape)
        } catch(error) {
            this.logHelper.log(error as string, "error");
        }

    }

    // SCRAPE EVERY URL
}