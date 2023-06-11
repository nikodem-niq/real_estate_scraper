import { baseURL } from "../constants/config";
import { Scraper } from "./_";
import { OtodomSettings } from "../constants/interfaces";
import * as cheerio from 'cheerio';

export class Otodom extends Scraper {
    private saleExtendedUrl : string = baseURL.OTODOM.url+'/oferty/sprzedaz/mieszkanie/';
    private rentExtendedUrl : string = baseURL.OTODOM.url+'/oferty/wynajem/mieszkanie/';
    private settings : OtodomSettings;
    private pageCount: number = 0;

    constructor(settings: OtodomSettings) {
        super();
        this.settings = settings;
    }

    async initScrape() {
        const { city, type, areaHigh, areaLow, priceHigh, priceLow } = this.settings;
        let url = `${type === 'sale' ? this.saleExtendedUrl : this.rentExtendedUrl}${city}?${areaLow ? 'areaMin='+areaLow : ''}&${areaHigh ? 'areaMax='+areaHigh : ''}&${priceLow ? 'priceMin='+priceLow : ''}&${priceHigh ? 'priceHigh='+priceHigh : ''}`
        console.log(url)
        await this.fetchHtml(url)
        const pageCount = this.html.match(/"page_count":\d{1,}/gm);
        this.pageCount = pageCount ? Number(pageCount[0].slice(13,pageCount[0].length)) : 0
        // const jsonData = JSON.parse(this.getElementText("#__NEXT_DATA__"));
        // console.log(JSON.parse(jsonData));
        // const { props : { pageProps : { data : { searchAds : { items }}}}} = jsonData
        // console.log(jsonData.props.pageProps.data.searchAds.items)
        // console.log(this.pageCount)
    }

    // SCRAPE EVERY URL
}