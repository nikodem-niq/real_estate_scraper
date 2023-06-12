import { baseURL } from "../constants/config";
import { Scraper } from "./_";
import { IProperty, OtodomSettings } from "../constants/interfaces";
import { CsvHelper } from "../helpers/csvHelper";

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

    async initScrape() {
        const { city, type, areaHigh, areaLow, priceHigh, priceLow } = this.searchSettings;
        this.url = `${type === 'sale' ? this.saleExtendedUrl : this.rentExtendedUrl}${city}?${areaLow ? 'areaMin='+areaLow : ''}&${areaHigh ? 'areaMax='+areaHigh : ''}&${priceLow ? 'priceMin='+priceLow : ''}&${priceHigh ? 'priceMax='+priceHigh : ''}`
        console.log(`========== STARTING SCRAPING SCOPE: ${this.url} =============`)
        await this.fetchHtml(this.url)
        const pageCount = this.html.match(/"page_count":\d{1,}/gm);
        this.pageCount = pageCount ? Number(pageCount[0].slice(13,pageCount[0].length)) : 0
        console.log(this.pageCount)
        this.runScrapeProperties();
    }

    async runScrapeProperties() {
        for(let i=1; i<=this.pageCount; i++) {
            this.url = `${this.url}&page=${i}`;
            await this.fetchHtml(this.url);
            console.log(`Fetching OTODOM properties, current progress: ${i}/${this.pageCount} sites`)
            const siteData = JSON.parse(this.getElementText("#__NEXT_DATA__"));
            const { props : { pageProps : { data : { searchAds : { items }}}}} = siteData
            for(const propertyData of items) {
                this.properties.push(`${this.propertyUrl}${propertyData.slug}`)
            }
        }
        this.runScrapeProperty();
    }

    async runScrapeProperty() {
        try{
            const excelHelper = new CsvHelper();
            excelHelper.addHeaderRow();
            let propertyCounter: number = 0;
            for(const propertyData of this.properties) {
                propertyCounter++;
                console.log(`Scraping progress: ${Math.ceil(propertyCounter/(36*this.pageCount)*100)}%`)
                // const testProperty = this.properties[0];
                await this.fetchHtml(propertyData);
                const propertyJSON = JSON.parse(this.getElementText("#__NEXT_DATA__"));
                const { ad, ad: { target } } = propertyJSON.props.pageProps;

                // Set property values
                this.Property.type = target.ProperType || "unknown";
                this.Property.city = target.City || "unknown";
                this.Property.street = ad.address?.street || "unknown";
                this.Property.area = target.Area || 0;
                this.Property.priceForMetre = target.Price_per_m || 0;
                this.Property.fullPrice = target.Price || 0;
                this.Property.ownerType = target.user_type || "unknown"
                this.Property.propertyCondition = "unknown";
                this.Property.standard = "unknown";
                this.Property.phoneNumber = ad.owner.phones[0] || "unknown";
                this.Property.ownerName = ad.owner.name || "unknown";
                this.Property.urlToProperty = ad.url || "unknown";
                // console.log(this.Property.propertyData)
                excelHelper.addPropertyRow(this.Property.propertyData as IProperty)
                excelHelper.saveExcelFile();
            }
        } catch(error) {
            console.error(error);
        }

    }

    // SCRAPE EVERY URL
}