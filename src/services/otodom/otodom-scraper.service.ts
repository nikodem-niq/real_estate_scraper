import moment from "moment";
import { BASE_URLS } from "../../constants/types";
import { ExcelHelper } from "../excelService/excelService.service";
import { PropertiesService } from "../properties/properties.service";
import { Scraper } from "../scraper/scraper.service";
import { randomizeId } from "../../helpers/helpers";

class OtodomService extends Scraper {
    private scraperName: string = 'OTODOM';
    private BASE_URL = BASE_URLS.OTODOM_BASE_URL;
    private URL : string = '';
    private excelHelper = new ExcelHelper();

    constructor() {
        super();
    }

    public async initScrape(settings: OtodomSettings) : Promise<number> {
        const parsedUrl = this.createUrlFromSettings(settings)
        this.URL = parsedUrl;
        console.log(parsedUrl)
        const requestedHtml = await this.fetchHtml(parsedUrl); // it should returns `response.text()`
        if(requestedHtml && typeof requestedHtml === 'string') {
            const pageCount = requestedHtml?.match(/"page_count":\d{1,}/gm);
            return pageCount ? Number(pageCount[0]?.slice(13,pageCount[0].length)) : 0
        }
        return 0;
    }

    public async runScrapeProperties(pageCount: number) : Promise<string[]> {
        const properties : string[] = [];
        for(let i=1; i<=pageCount; i++) {
            const currentScrapingUrl = `${this.URL}&page=${i}`;
            const currentPropertiesListHtml = await this.fetchHtml(currentScrapingUrl) as string;

            console.log(`Fetching OTODOM properties, current progress: ${i}/${pageCount} sites`)

            if(!JSON.parse(this.getElementText(currentPropertiesListHtml, "#__NEXT_DATA__"))) continue;
            const siteData = JSON.parse(this.getElementText(currentPropertiesListHtml, "#__NEXT_DATA__"));
            const { props : { pageProps : { data : { searchAds : { items }}}}} = siteData
            for(const propertyData of items) {
                properties.push(`${BASE_URLS.OTODOM_BASE_URL_OFFER}${propertyData.slug}`)
            }
        }

        return properties;
    }

    public async runScrapeProperty(properties: string[], pageCount: number) : Promise<any> {
        this.excelHelper.addHeaderRow();
        let propertyCounter: number = 0;
        const fileName = `${this.scraperName}_${moment().format('MM.DD')}_${randomizeId()}`;

        for(const propertyData of properties) {
            const Property = new PropertiesService()
            propertyCounter++;

            console.log(`Scraping progress: ${propertyCounter}/${properties.length}`, "log")
            
            try {
                const currentPropertyHtml = await this.fetchHtml(propertyData) as string;
                if(!JSON.parse(this.getElementText(currentPropertyHtml, "#__NEXT_DATA__"))) continue;
                const propertyJSON = JSON.parse(this.getElementText(currentPropertyHtml, "#__NEXT_DATA__"));
                const { ad, ad: { target } } = propertyJSON.props.pageProps;
                Property.feedProperty.scraperName(this.scraperName);
                Property.feedProperty.type(target?.ProperType);
                Property.feedProperty.city(target?.City);
                Property.feedProperty.street(ad?.location?.address?.street?.name)
                Property.feedProperty.area(target?.Area)
                Property.feedProperty.priceForMetre(target?.Price_per_m)
                Property.feedProperty.fullPrice(target?.Price)
                Property.feedProperty.ownerType(target?.user_type)
                Property.feedProperty.phoneNumber(ad?.owner?.phones[0])
                Property.feedProperty.ownerName(ad?.owner?.name)
                Property.feedProperty.urlToProperty(ad?.url)
    
                const { data } = Property;
    
    
                this.excelHelper.addPropertyRow(data)
                await this.excelHelper.saveExcelFile(fileName as string);
            } catch(error) {
                console.error(error);
                continue;
            }

        }

        if(properties.length !== propertyCounter) return false;
        return {
            status: 'scrapped',
            file: fileName
        };
    }

    private createUrlFromSettings({voivoideship, city, type, ownerTypeSearching, propertyType, priceLow, priceHigh, areaLow, areaHigh}: OtodomSettings) : string {
        // https://www.otodom.pl/pl/wyniki/wynajem/mieszkanie/dolnoslaskie/wroclaw/wroclaw/wroclaw?distanceRadius=0&page=1&limit=36&priceMin=500&priceMax=5000&areaMin=20&areaMax=200&isPrivateOwner=true&by=DEFAULT&direction=DESC&viewType=listing
        const _type = type === 'sprzedaz' ? 'sprzedaz' : 'wynajem';
        const _propertyType = propertyType ? propertyType : '';
        const _voivoideship = voivoideship ? voivoideship : '';
        const _city = city ? city : '';
        const _priceLow = priceLow ? `priceMin=${priceLow}&` : '';
        const _priceHigh = priceHigh ? `priceMax=${priceHigh}&` : '';
        const _areaLow = areaLow ? `areaMin=${areaLow}&` : '';
        const _areaHigh = areaHigh ? `areaMax=${areaHigh}&` : '';
        const _ownerTypeSearching = ownerTypeSearching === 'PRIVATE' ? `isPrivateOwner=true&` : '';
        
        const parsedUrl = `${this.BASE_URL}${_type}/${_propertyType}/${_voivoideship}/${_city}/${_city}/${_city}?${_priceLow}${_priceHigh}${_areaLow}${_areaHigh}${_ownerTypeSearching}`;
        return parsedUrl;
    }
}

export default OtodomService;


type ScraperSettingType = "wynajem" | "sprzedaz";
type ScraperOwnerTypeSearching = "PRIVATE";
type OtodomPropertySettingType = "mieszkanie" | "dom" | "kawalerka" | "inwestycja" | "pokoj" | "dzialka" | "lokal" | "haleimagazyny" | "garaz";


export interface OtodomSettings {
    type: ScraperSettingType;
    propertyType: OtodomPropertySettingType; 
    voivoideship: string;
    city: string;
    ownerTypeSearching?: ScraperOwnerTypeSearching; 
    priceLow?: number;
    priceHigh?: number;
    areaLow?: number;
    areaHigh?: number;
}