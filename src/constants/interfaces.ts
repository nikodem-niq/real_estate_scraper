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

export interface IHttpClient {
    get(url: string): Promise<string>;
  }