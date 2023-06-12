import { baseURL } from "./constants/config";
import { Otodom } from "./services/otodom";

const Scraper = new Otodom({city: 'wroclaw', type: 'rent', areaLow: 50, areaHigh: 80, priceLow: 3900, priceHigh: 4300});
Scraper.initScrape();
