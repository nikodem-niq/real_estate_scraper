import { baseURL } from "../constants/config";
import { Scraper } from "./_";
import { OtodomSettings } from "../constants/interfaces";
import * as cheerio from 'cheerio';

export class Otodom extends Scraper {
    private saleExtendedUrl : string = baseURL.OTODOM.url+'/oferty/sprzedaz/mieszkanie/';
    private rentExtendedUrl : string = baseURL.OTODOM.url+'/oferty/wynajem/mieszkanie/';
    private propertyUrl : string = baseURL.OTODOM.url+'/oferta/';
    private settings : OtodomSettings;
    private pageCount: number = 0;
    private url: string = '';
    private properties: Array<string> = [];

    constructor(settings: OtodomSettings) {
        super();
        this.settings = settings;
    }

    async initScrape() {
        const { city, type, areaHigh, areaLow, priceHigh, priceLow } = this.settings;
        this.url = `${type === 'sale' ? this.saleExtendedUrl : this.rentExtendedUrl}${city}?${areaLow ? 'areaMin='+areaLow : ''}&${areaHigh ? 'areaMax='+areaHigh : ''}&${priceLow ? 'priceMin='+priceLow : ''}&${priceHigh ? 'priceMax='+priceHigh : ''}`
        console.log(this.url)
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
        const testProperty = this.properties[0];
        const siteData = JSON.parse(this.getElementText("#__NEXT_DATA__"));
        const { props : { pageProps : { data : { searchAds : { items }}}}} = siteData
        // for(const propertyData of items) {
            
        // }

    }

    // SCRAPE EVERY URL
}