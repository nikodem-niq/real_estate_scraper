import { baseURL } from "../constants/config";
import { Scraper } from "./_";
import { IProperty, OtodomSettings, WhichScraperFrom } from "../constants/interfaces";
import { CsvHelper } from "../helpers/csvHelper";
import { Logger } from "../helpers/loggerHelper";

export class Morizon extends Scraper { 
    private saleExtendedUrl : string = baseURL.MORIZON.url+'/mieszkania/';
    private rentExtendedUrl : string = baseURL.MORIZON.url+'/do-wynajecia/mieszkania/';
    private propertyUrl : string = baseURL.MORIZON.url+'/oferta/';
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
        try{
            const { city, type, areaHigh, areaLow, priceHigh, priceLow } = this.searchSettings;
            this.url = `${type === 'sale' ? this.saleExtendedUrl : this.rentExtendedUrl}${city}?${areaLow ? 'ps%5Bliving_area_from%5D='+areaLow : ''}&${areaHigh ? 'ps%5Bliving_area_to%5D='+areaHigh : ''}&${priceLow ? 'ps%5Bprice_from%5D='+priceLow : ''}&${priceHigh ? 'ps%5Bprice_to%5D='+priceHigh : ''}`
            this.logHelper.log(`========== STARTING SCRAPING SCOPE: ${this.url} =============`, "log")
            await this.launchBrowser({headless: true, slowMo: 30});
            const pageCount = await this.getLastElementTextFromClass(this.url, "pagination__item");
            await this.closeBrowser();
            this.pageCount = Number(pageCount);
        } catch(error) {
            this.logHelper.log(error as string, "error");
        }
    }

    async runScrapeProperties() {
        try{

        } catch(error) {
            this.logHelper.log(error as string, "error");
        }
    }

    async runScrapeProperty() {
        try{

        } catch(error) {
            this.logHelper.log(error as string, "error");
        }

    }

    // SCRAPE EVERY URL
}