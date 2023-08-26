import moment from "moment";
import { BASE_URLS } from "../../constants/types";
import { ExcelHelper } from "../excelService/excelService.service";
import { PropertiesService } from "../properties/properties.service";
import { Scraper } from "../scraper/scraper.service";

class OtodomService extends Scraper {
    private BASE_URL = BASE_URLS.OTODOM_BASE_URL;
    private URL : string = '';
    private excelHelper = new ExcelHelper();


    constructor() {
        super();
    }

    public async initScrape(settings: OtodomSettings) : Promise<number> {
        const parsedUrl = this.createUrlFromSettings(settings)
        this.URL = parsedUrl;
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
            // this.logHelper.log(`Fetching OTODOM properties, current progress: ${i}/${this.pageCount} sites`, "log")
            if(!JSON.parse(this.getElementText(currentPropertiesListHtml, "#__NEXT_DATA__"))) continue;
            const siteData = JSON.parse(this.getElementText(currentPropertiesListHtml, "#__NEXT_DATA__"));
            const { props : { pageProps : { data : { searchAds : { items }}}}} = siteData
            for(const propertyData of items) {
                properties.push(`${BASE_URLS.OTODOM_BASE_URL_OFFER}${propertyData.slug}`)
            }
        }

        return properties;
    }

    public async runScrapeProperty(properties: string[]) : Promise<any> {
        this.excelHelper.addHeaderRow();
        let propertyCounter: number = 0;
        const randomizedIdOfFile = Math.floor(Math.random() * 9999);

        for(const propertyData of properties) {
            propertyCounter++;
            // this.logHelper.log(`Scraping progress: ${Math.ceil(propertyCounter/(36*this.pageCount)*100)}%`, "log")
            const currentPropertyHtml = await this.fetchHtml(propertyData) as string;
            if(!JSON.parse(this.getElementText(currentPropertyHtml, "#__NEXT_DATA__"))) continue;
            const propertyJSON = JSON.parse(this.getElementText(currentPropertyHtml, "#__NEXT_DATA__"));
            const { ad, ad: { target } } = propertyJSON.props.pageProps;

            // Set property values
            const PropertyValues = {
                scraper: 'OTODOM',
                type: target?.ProperType,
                city: target?.City,
                street: ad?.location?.address?.street?.name,
                area: target?.Area,
                priceForMetre : target?.Price_per_m,
                fullPrice : target?.Price,
                ownerType : target?.user_type,
                propertyCondition : "unknown",
                standard : "unknown",
                phoneNumber : ad?.owner?.phones[0],
                ownerName : ad?.owner?.name,
                urlToProperty : ad?.url
            }

            const PropertyInstance = new PropertiesService(PropertyValues)

            // this.Property.scraper = baseURL.OTODOM.name;
            // this.Property.type = target?.ProperType || "unknown";
            // this.Property.city = target?.City || "unknown";
            // this.Property.street = ad?.location?.address?.street?.name || "unknown";
            // this.Property.area = target?.Area || 0;
            // this.Property.priceForMetre = target?.Price_per_m || 0;
            // this.Property.fullPrice = target?.Price || 0;
            // this.Property.ownerType = target?.user_type || "unknown"
            // this.Property.propertyCondition = "unknown";
            // this.Property.standard = "unknown";
            // this.Property.phoneNumber = ad?.owner?.phones[0] || "unknown";
            // this.Property.ownerName = ad?.owner?.name || "unknown";
            // this.Property.urlToProperty = ad?.url || "unknown";

            this.excelHelper.addPropertyRow(PropertyValues)
            this.excelHelper.saveExcelFile(`${PropertyValues.scraper}_${moment().format('MM.DD')}_${randomizedIdOfFile}` as string);
        }
        return true;
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

export default new OtodomService();


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