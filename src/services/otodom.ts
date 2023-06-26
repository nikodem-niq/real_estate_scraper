import { baseURL } from "../constants/config";
import { Scraper } from "./_";
import { IProperty, IPropertyScraper, ScraperSettings, WhichScraperFrom } from "../constants/interfaces";
import { CsvHelper } from "../helpers/csvHelper";
import { Logger } from "../helpers/loggerHelper";
import moment from "moment";

export class Otodom extends Scraper implements IPropertyScraper { 
    private saleExtendedUrl : string = baseURL.OTODOM.url+'/oferty/sprzedaz/mieszkanie/';
    private rentExtendedUrl : string = baseURL.OTODOM.url+'/oferty/wynajem/mieszkanie/';
    private propertyUrl : string = baseURL.OTODOM.url+'/oferta/';
    private searchSettings : ScraperSettings;
    private pageCount: number = 0;
    private url: string = '';
    private properties: Array<string> = [];

    constructor(settings: ScraperSettings) {
        super();
        this.searchSettings = settings;
    }

    private logHelper = new Logger(baseURL.OTODOM.name as string);
    private excelHelper = new CsvHelper();


    public async initScrape() {
        try {
            const { city, type, areaHigh, areaLow, priceHigh, priceLow, ownerTypeSearching } = this.searchSettings;
            this.url = `${type === 'sale' ? this.saleExtendedUrl : this.rentExtendedUrl}${city}?${areaLow ? 'areaMin='+areaLow : ''}&${areaHigh ? 'areaMax='+areaHigh : ''}&${priceLow ? 'priceMin='+priceLow : ''}&${priceHigh ? 'priceMax='+priceHigh : ''}&${ownerTypeSearching ? 'ownerTypeSingleSelect='+ownerTypeSearching : ''}`
            this.logHelper.log(`========== STARTING SCRAPING SCOPE: ${this.url} =============`, "log");
            const res = await this.fetchHtml(this.url) as Response;
            this._html = await res.text() as unknown as string;
            const pageCount = this._html.match(/"page_count":\d{1,}/gm);
            this.pageCount = pageCount ? Number(pageCount[0].slice(13,pageCount[0].length)) : 0
            this.runScrapeProperties();
            // this.runScrapeProperty();
        } catch(error) {
            this.logHelper.log(error as string, "error");
        }
    }

    public async runScrapeProperties() : Promise<void> {
        try {
            // for(let i=1; i<=this.pageCount; i++) {
            for(let i=1; i<=this.pageCount; i++) {
                this.url = `${this.url}&page=${i}`;
                const res = await this.fetchHtml(this.url) as Response;
                this._html = await res.text() as unknown as string;
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

    public async runScrapeProperty() : Promise<void> {
        try{
            this.excelHelper.addHeaderRow();
            let propertyCounter: number = 0;

            // let property = [`https://www.otodom.pl/pl/oferta/mieszkanie-3-pokojowe-przy-metrze-kabaty-ID4kEfj`];
            const randomizedIdOfFile = Math.floor(Math.random() * 9999);
            for(const propertyData of this.properties) {
            // for(const propertyData of property) {
                propertyCounter++;
                this.logHelper.log(`Scraping progress: ${Math.ceil(propertyCounter/(36*this.pageCount)*100)}%`, "log")
                // const testProperty = this.properties[0];
                const res = await this.fetchHtml(propertyData) as Response;
                this._html = await res.text() as unknown as string;
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

                this.excelHelper.addPropertyRow(this.Property.propertyData as IProperty)
                this.excelHelper.saveExcelFile(`${this.Property.scraper}_${moment().format('MM.DD')}_${randomizedIdOfFile}` as string);
            }
        } catch(error) {
            this.logHelper.log(error as string, "error");
        }

    }
}