import { launch, Browser, BrowserConnectOptions } from "puppeteer";
import HttpClient from "../httpClient/httpClient.service";
import { load } from "cheerio";

export class Scraper {
    private browser: Browser | null = null;
    private httpClient : HttpClient = HttpClient.getInstance();

    protected async launchBrowser(options: BrowserConnectOptions): Promise<void> {
        try {
          this.browser = await launch(options);
        } catch (error) {
          console.error('Error launching browser:', error);
        }
      }
    
    protected async disposeBrowser() : Promise<void> {
        try {
            if(this.browser) {
                this.browser.close();
            }
        } catch(error) {
            console.error('Error disposing browser:', error);
        }
    }

    protected async fetchHtmlWithPuppeteer(url: string) : Promise<string | []> {
        try {
            if(!this.browser) {
              throw new Error('Browser not launched. Call launchBrowser() first.');
            }
            const page = await this.browser.newPage();
            await page.goto(url);
            const html = await page.content();  
            return html;
        } catch(error) {
            console.error(`Error fetching HTML from ${url}:`, error);
            return [];
        }
      }

    protected async fetchHtml(url: string): Promise<string|[]> {
        try {
            const response = await this.httpClient.get(url);
            return response;
        } catch (error) {
            console.error(`Error fetching HTML from ${url}:`, error);
            return [];
        }
    }

    protected getElementText(html: string, selector: string): string {
      try {
        const $ = load(html);
        return $(selector).text();
      } catch(error) {
        console.error(`Error getting text from ${selector}:`, error);
        return '';
      }
    }

  //   protected async checkAvailabilityOfProperty(scraperName: string, dataToRescrape: any, logHelper: any) : Promise<Array<string>> {
  //   const unavailableProperties : Array<string> = [];
  //   try {
      
  //     if(dataToRescrape) {
  //       let propCounter: number = 0;
  //       for(const property of dataToRescrape) {
  //           // if(propCounter > 3) continue
  //           propCounter++;
  //           logHelper.log(`Re-scraping progress: ${Math.ceil(propCounter/dataToRescrape.length*100)}%`, "log")
  //           if(property !== null && typeof property === 'object' && 'text' in property) {
  //               const res = await this.fetchHtml(property.text) as Response;
  //               this._html = await res.text() as unknown as string;
  //               const actualUrl : string = res.url;
  //               if(actualUrl != property.text) {
  //                   unavailableProperties.push(property.text as string);
  //               }
  //           } else if(property !== null && typeof property === 'object' && 'formula' in property && property.formula && /HYPERLINK\("([^"]+)",\s*"[^"]+"\)/i.test(property.formula)) {
  //               const matchedHtml = property.formula.match(/HYPERLINK\("([^"]+)",\s*"[^"]+"\)/i);
  //               if(matchedHtml) {
                    
  //                   const res = await this.fetchHtml(matchedHtml[1] as string) as Response;
  //                   this._html = await res.text() as unknown as string;
  //                   const actualUrl : string = res.url;  
  //                   if(actualUrl != matchedHtml[1]) {
  //                       unavailableProperties.push(matchedHtml[1] as string);
  //                   }
  //               }
  //           } else {
  //               const res = await this.fetchHtml(property as string) as Response;
  //               this._html = await res.text() as unknown as string;
  //               const actualUrl : string = res.url;
  //               if(actualUrl != property) {
  //                   unavailableProperties.push(property as string);
  //               }
  //           }
  //       }
  //     }
  //   } catch(error) {
  //     logHelper.log(error as string, "error");
  //   }

  //   return unavailableProperties
  // }
}