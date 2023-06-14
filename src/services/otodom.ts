import { baseURL } from "../constants/config";
import { Scraper } from "./_";
import { IProperty, OtodomSettings, WhichScraperFrom } from "../constants/interfaces";
import { CsvHelper } from "../helpers/csvHelper";
import { Logger } from "../helpers/loggerHelper";

export class Otodom extends Scraper { 
    private saleExtendedUrl : string = baseURL.OTODOM.url+'/oferty/sprzedaz/mieszkanie/';
    private rentExtendedUrl : string = baseURL.OTODOM.url+'/oferty/wynajem/mieszkanie/';
    private propertyUrl : string = baseURL.OTODOM.url+'/oferta/';
    private searchSettings : OtodomSettings;
    private pageCount: number = 0;
    private url: string = '';
    private properties: Array<string> = [];

    constructor(settings: OtodomSettings) {
        super();
        this.searchSettings = settings;
    }

    logHelper = new Logger(baseURL.OTODOM.name as string);

    async initScrape() {
        try {
            const { city, type, areaHigh, areaLow, priceHigh, priceLow } = this.searchSettings;
            this.url = `${type === 'sale' ? this.saleExtendedUrl : this.rentExtendedUrl}${city}?${areaLow ? 'areaMin='+areaLow : ''}&${areaHigh ? 'areaMax='+areaHigh : ''}&${priceLow ? 'priceMin='+priceLow : ''}&${priceHigh ? 'priceMax='+priceHigh : ''}`
            this.logHelper.log(`========== STARTING SCRAPING SCOPE: ${this.url} =============`, "log")
            await this.fetchHtml(this.url)
            const pageCount = this.html.match(/"page_count":\d{1,}/gm);
            this.pageCount = pageCount ? Number(pageCount[0].slice(13,pageCount[0].length)) : 0
            this.runScrapeProperties();
        } catch(error) {
            this.logHelper.log(error as string, "error");
        }
    }

    async runScrapeProperties() {
        try {
            for(let i=1; i<=1; i++) {
                this.url = `${this.url}&page=${i}`;
                await this.fetchHtml(this.url);
                this.logHelper.log(`Fetching OTODOM properties, current progress: ${i}/${this.pageCount} sites`, "log")
                const siteData = JSON.parse(this.getElementText("#__NEXT_DATA__"));
                const { props : { pageProps : { data : { searchAds : { items }}}}} = siteData
                for(const propertyData of items) {
                    this.properties.push(`${this.propertyUrl}${propertyData.slug}`)
                }
            }
            this.runScrapeProperty();
        } catch(error) {
            this.logHelper.log(error as string, "error");
        }
    }

    async runScrapeProperty() {
        try{
            const excelHelper = new CsvHelper();
            excelHelper.addHeaderRow();
            let propertyCounter: number = 0;
            for(const propertyData of this.properties) {
                propertyCounter++;
                this.logHelper.log(`Scraping progress: ${Math.ceil(propertyCounter/(36*this.pageCount)*100)}%`, "log")
                // const testProperty = this.properties[0];
                await this.fetchHtml(propertyData);
                const propertyJSON = JSON.parse(this.getElementText("#__NEXT_DATA__"));
                const { ad, ad: { target } } = propertyJSON.props.pageProps;
                // Set property values
                this.Property.scraper = baseURL.OTODOM.name as WhichScraperFrom;
                this.Property.type = target.ProperType || "unknown";
                this.Property.city = target.City || "unknown";
                this.Property.street = ad.location?.address?.street?.name || "unknown";
                this.Property.area = target.Area || 0;
                this.Property.priceForMetre = target.Price_per_m || 0;
                this.Property.fullPrice = target.Price || 0;
                this.Property.ownerType = target.user_type || "unknown"
                this.Property.propertyCondition = "unknown";
                this.Property.standard = "unknown";
                this.Property.phoneNumber = ad.owner?.phones[0] || "unknown";
                this.Property.ownerName = ad.owner?.name || "unknown";
                this.Property.urlToProperty = ad.url || "unknown";
                excelHelper.addPropertyRow(this.Property.propertyData as IProperty)
                excelHelper.saveExcelFile(this.Property.scraper as string);
            }
        } catch(error) {
            this.logHelper.log(error as string, "error");
        }

    }

    // SCRAPE EVERY URL
}