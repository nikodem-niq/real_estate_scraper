import { baseURL } from "./constants/config";
import { Morizon } from "./services/morizon";
import { Otodom } from "./services/otodom";

const ScraperOtodom1 = new Otodom({city: 'wroclaw', type: 'rent', areaLow: 50, areaHigh: 80, priceLow: 3900, priceHigh: 4300});
// const ScraperOtodom2 = new Otodom({city: 'wroclaw', type: 'rent'});
// const Scraper2 = new Morizon({city: 'wroclaw', type: 'rent', propertyType: 'mieszkania', areaLow: 50, areaHigh: 400, priceHigh: 3500, priceLow: 3300});



ScraperOtodom1.initScrape();
// ScraperOtodom1.rescrapePropertiesFromExcel();