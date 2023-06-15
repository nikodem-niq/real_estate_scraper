import { baseURL } from "./constants/config";
import { Morizon } from "./services/morizon";
import { Otodom } from "./services/otodom";

const Scraper = new Otodom({city: 'wroclaw', type: 'rent', areaLow: 50, areaHigh: 80, priceLow: 3900, priceHigh: 4300});
const Scraper2 = new Morizon({city: 'wroclaw', type: 'rent', propertyType: 'domy'});
Scraper2.initScrape();
