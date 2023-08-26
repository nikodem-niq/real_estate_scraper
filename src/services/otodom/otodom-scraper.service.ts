import { BASE_URLS } from "../../constants/types";
import { Scraper } from "../scraper/scraper.service";

class OtodomService extends Scraper {
    private BASE_URL = BASE_URLS.OTODOM_BASE_URL

    constructor() {
        super();
    }

    public async initScrape(...query : []) {
        const res = await this.fetchHtml(this.BASE_URL);
        console.log(res);
        // return res;
    }

    public async runScrapeProperties() : Promise<void> {
    }

    public async runScrapeProperty() : Promise<void> {
    }
}

export default new OtodomService();