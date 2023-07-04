export interface IPropertyMainScraper {
    initScrape(): Promise<void>;
    runScrapeProperties(): Promise<void>;
    runScrapeProperty(): Promise<void>;
    rescrapePropertiesFromExcel(): Promise<void>;
    checkAvailabilityOfProperty() : Promise<void>
    // Dodaj inne metody z klasy Otodom, jeśli są potrzebne
    // np. metody do dodawania nagłówka, wierszy itp.
    // oraz metody zależne od innych interfejsów, takich jak `checkAvailabilityOfProperty`
  }

export interface IPropertyScraper {
    initScrape(): Promise<void>;
    runScrapeProperties(): Promise<void>;
    runScrapeProperty(): Promise<void>;
    // Dodaj inne metody z klasy Otodom, jeśli są potrzebne
    // np. metody do dodawania nagłówka, wierszy itp.
    // oraz metody zależne od innych interfejsów, takich jak `checkAvailabilityOfProperty`
  }


interface ReadExcelOptions {
    cell?: string;
    column?: string;
}

interface CellValue {
    text?: string;
    formula?: string;
  }

export interface ICsvHelper {
    addHeaderRow(): void;
    addPropertyRow(Property: IProperty): void;
    saveExcelFile(scraperName: string): Promise<void>;
    readExcelFile(fileName: string, options?: ReadExcelOptions) : any ;
    highlightExpiredProperties(fileName: string, expiredProperties: Array<any>): Promise<void>;
  }

export interface IHttpClient {
    get(url: string): Promise<any>;
}

export type WhichScraperFrom = "OTODOM" | "MORIZON" | "unknown";


export type PropertyType = "mieszkanie" | "dom" | "unknown";
export type PropertyOwnerType = "private" | "developer" | "unknown";
export interface IProperty {
    scraper: WhichScraperFrom;
    type: PropertyType;
    city: string | "unknown";
    street: string | "unknown";
    area: number;
    priceForMetre: number;
    fullPrice: number;
    ownerType: PropertyOwnerType;
    propertyCondition: string | "unknown";
    standard: string | "unknown";
    phoneNumber: string | "unknown";
    ownerName: string | "unknown";
    urlToProperty: string | "unknown";
  }

export interface IPropertyAccess {
    type(value: PropertyType) : void
}

export interface ScraperURLSettings {
    [scraper: string] : { name: string; url: string; }
}

type ScraperSettingType = "sale" | "rent";
type ScraperOwnerTypeSearching = "DEVELOPER" | "PRIVATE";
type OtodomPropertySettingType = "mieszkanie" | "dom" | "kawalerka" | "inwestycja" | "pokoj" | "dzialka" | "lokal" | "haleimagazyny" | "garaz";
type MorizonPropertySettingType = "mieszkania" | "domy";
export interface ScraperSettings {
    city: string;
    type: ScraperSettingType;
    ownerTypeSearching?: ScraperOwnerTypeSearching; 
    propertyType?: OtodomPropertySettingType | MorizonPropertySettingType; 
    priceLow?: number;
    priceHigh?: number;
    areaLow?: number;
    areaHigh?: number;
}


// type OtodomSettingType = "sale" | "rent";
// type OwnerTypeSearching = "DEVELOPER" | "PRIVATE";
// export interface OtodomSettings {
//     city: string;
//     type: OtodomSettingType;
//     ownerTypeSearching: OwnerTypeSearching; 
//     priceLow?: number;
//     priceHigh?: number;
//     areaLow?: number;
//     areaHigh?: number;
// }
// type MorizonSettingType = "sale" | "rent";
// type MorizonPropertySettingType = "mieszkania" | "domy";
// export interface MorizonSettings {
//     city: string;
//     propertyType: MorizonPropertySettingType;
//     type: MorizonSettingType;
//     priceLow?: number;
//     priceHigh?: number;
//     areaLow?: number;
//     areaHigh?: number;
// }