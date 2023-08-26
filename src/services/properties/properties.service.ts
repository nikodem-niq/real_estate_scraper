// import { IProperty, PropertyType, PropertyOwnerType, WhichScraperFrom } from "../constants/interfaces";

export class PropertiesService {
    private _propertyData;
  
    constructor(propertyData: any) {
        if(propertyData) {
            this._propertyData = propertyData;
        } else {
            this._propertyData = this.setDefaultValues();
        }
    }
    // propertyData

    get propertyData() : Object {
        return this._propertyData;
    }

    // Setters and getters for specific values of propertyData
  
    set scraper(value: string) {
      this._propertyData.scraper = value;
    }

    set type(value: string) {
      this._propertyData.type = value;
    }
  
    set city(value: string) {
      this._propertyData.city = value;
    }
  
    set street(value: string) {
      this._propertyData.street = value;
    }
  
    set area(value: number) {
      this._propertyData.area = value;
    }
  
    set priceForMetre(value: number) {
      this._propertyData.priceForMetre = value;
    }
  
    set fullPrice(value: number) {
      this._propertyData.fullPrice = value;
    }
  
    set ownerType(value: string) {
      this._propertyData.ownerType = value;
    }
  
    set propertyCondition(value: string) {
      this._propertyData.propertyCondition = value;
    }
  
    set standard(value: string) {
      this._propertyData.standard = value;
    }
  
    set phoneNumber(value: string) {
      this._propertyData.phoneNumber = value;
    }
  
    set ownerName(value: string) {
      this._propertyData.ownerName = value;
    }
  
    set urlToProperty(value: string) {
      this._propertyData.urlToProperty = value;
    }
  
    get scraper() : string {
      return this._propertyData.scraper;
    }

    get type(): string {
      return this._propertyData.type;
    }
  
    get city(): string {
      return this._propertyData.city;
    }
  
    get street(): string {
      return this._propertyData.street;
    }
  
    get area(): number {
      return this._propertyData.area;
    }
  
    get priceForMetre(): number {
      return this._propertyData.priceForMetre;
    }
  
    get fullPrice(): number {
      return this._propertyData.fullPrice;
    }
  
    get ownerType(): string {
      return this._propertyData.ownerType;
    }
  
    get propertyCondition(): string {
      return this._propertyData.propertyCondition;
    }
  
    get standard(): string {
      return this._propertyData.standard;
    }
  
    get phoneNumber(): string {
      return this._propertyData.phoneNumber;
    }
  
    get ownerName(): string {
      return this._propertyData.ownerName;
    }
  
    get urlToProperty(): string {
      return this._propertyData.urlToProperty;
    }

    setDefaultValues() : object {
        return {
            scraper: 'unknown',
            type: 'unknown',
            city: 'unknown',
            street: 'unknown',
            area: 0,
            priceForMetre: 0,
            fullPrice: 0,
            ownerType: 'unknown',
            propertyCondition: 'unknown',
            standard: 'unknown',
            phoneNumber: 'unknown',
            ownerName: 'unknown',
            urlToProperty: 'unknown'
        } 
    }
  }
  