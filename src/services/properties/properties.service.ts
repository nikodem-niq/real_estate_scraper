// import { IProperty, PropertyType, PropertyOwnerType, WhichScraperFrom } from "../constants/interfaces";

import { IProperty } from "../../constants/types";

export class PropertiesService {
    private scraperName!: string;
    private type!: string;
    private city!: string;
    private street!: string;
    private propertyCondition!: string;
    private standard!: string;
    private ownerType!: string;
    private phoneNumber!: string;
    private ownerName!: string;
    private area!: number;
    private priceForMetre!: number;
    private fullPrice!: number;
    private urlToProperty!: string;
  
    constructor() { }

    readonly feedProperty = {
      scraperName: (scraperName: string) => (this.scraperName = scraperName),
      type: (type: string) => (this.type = type),
      city: (city: string) => (this.city = city),
      street: (street: string) => (this.street = street),
      propertyCondition: (propertyCondition: string) => (this.propertyCondition = propertyCondition),
      standard: (standard: string) => (this.standard = standard),
      ownerType: (ownerType: string) => (this.ownerType = ownerType),
      phoneNumber: (phoneNumber: string) => (this.phoneNumber = phoneNumber),
      ownerName: (ownerName: string) => (this.ownerName = ownerName),
      area: (area: number) => (this.area = area),
      priceForMetre: (priceForMetre: number) => (this.priceForMetre = priceForMetre),
      fullPrice: (fullPrice: number) => (this.fullPrice = fullPrice),
      urlToProperty: (urlToProperty: string) => (this.urlToProperty = urlToProperty),

    }

    public get data() : IProperty {
      // Validate then return Property
      this.feedProperty.scraperName(this.scraperName.toUpperCase());

      // Default values if something is missing
      if(!this.type) this.feedProperty.type('unknown');
      if(!this.city) this.feedProperty.city('unknown');
      if(!this.street) this.feedProperty.street('unknown');
      if(!this.propertyCondition) this.feedProperty.propertyCondition('unknown');
      if(!this.standard) this.feedProperty.standard('unknown');
      if(!this.ownerType) this.feedProperty.ownerType('unknown');
      if(!this.phoneNumber) this.feedProperty.phoneNumber('unknown');
      if(!this.ownerName) this.feedProperty.ownerName('unknown');
      if(!this.area) this.feedProperty.area(0);
      if(!this.priceForMetre) this.feedProperty.priceForMetre(0);
      if(!this.fullPrice) this.feedProperty.fullPrice(0);
      if(!this.urlToProperty) this.feedProperty.urlToProperty('unknown');


      return {
        scraperName: this.scraperName,
        type: this.type,
        city: this.city,
        street: this.street,
        propertyCondition: this.propertyCondition,
        standard: this.standard,
        ownerType: this.ownerType,
        ownerName: this.ownerName,
        phoneNumber: this.phoneNumber,
        area: this.area,
        priceForMetre: this.priceForMetre,
        fullPrice: this.fullPrice,
        urlToProperty: this.urlToProperty
      }
    } 
  }
  