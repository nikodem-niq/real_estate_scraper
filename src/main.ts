import { baseURL } from "./constants/config";
import { Otodom } from "./services/otodom";

const Scraper = new Otodom({city: 'wroclaw', type: 'rent', areaLow: 30, areaHigh: 70, priceLow: 1000, priceHigh: 5000});
Scraper.initScrape();
