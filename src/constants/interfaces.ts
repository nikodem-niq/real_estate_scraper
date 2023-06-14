export interface IHttpClient {
    get(url: string): Promise<string>;
}

export type WhichScraperFrom = "OTODOM" | "unknown";
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

type OtodomSettingType = "sale" | "rent";
export interface OtodomSettings {
    city: string;
    type: OtodomSettingType;
    priceLow?: number;
    priceHigh?: number;
    areaLow?: number;
    areaHigh?: number;
}
type MorizonSettingType = OtodomSettingType;
export interface MorizonSettings {
    city: string;
    type: MorizonSettingType;
    priceLow?: number;
    priceHigh?: number;
    areaLow?: number;
    areaHigh?: number;
}