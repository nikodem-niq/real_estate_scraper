import { launch, Browser, BrowserConnectOptions } from "puppeteer";
import HttpClient from "../httpClient/httpClient.service";
import { load } from "cheerio";
import { Response } from "node-fetch";

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

    protected async fetchHtml(url: string): Promise<string | []> {
        try {
            const response = await this.httpClient.get(url);
            if('text' in response) {
              const html = await response.text();
              return html;
            }

            return [];
        } catch (error) {
            console.error(`Error fetching HTML from ${url}:`, error);
            // return [];
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

    protected async checkAvailabilityOfProperty(dataToRescrape: ({ text: string } | { formula: string } | string)[]) : Promise<string[]> {
      const unavailableProperties : string[] = [];
      try {
        if(dataToRescrape) {
          let propertyCounter: number = 0;
          for(const property of dataToRescrape) {
              propertyCounter++;

              console.log(`Re-scraping progress: ${propertyCounter/dataToRescrape.length}`)
              
              if(property !== null && typeof property === 'object' && 'text' in property) {
                  const res = await this.httpClient.get(property.text) as Response;
                  const actualUrl : string = res.url;
                  if(actualUrl != property.text) {
                      unavailableProperties.push(property.text as string);
                  }
              } 
              
              else if(property !== null && typeof property === 'object' && 'formula' in property && property.formula && /HYPERLINK\("([^"]+)",\s*"[^"]+"\)/i.test(property.formula)) {
                  const matchedHtml = property.formula.match(/HYPERLINK\("([^"]+)",\s*"[^"]+"\)/i);
                  if(matchedHtml) {
                      
                      const res = await this.httpClient.get(matchedHtml[1] as string) as Response;
                      const actualUrl : string = res.url;  
                      if(actualUrl != matchedHtml[1]) {
                          unavailableProperties.push(matchedHtml[1] as string);
                      }
                  }
              } 
              
              else {
                  const res = await this.httpClient.get(property as string) as Response;
                  const actualUrl : string = res.url;
                  if(actualUrl != property) {
                      unavailableProperties.push(property as string);
                  }
              }
          }
        }

        return unavailableProperties
      } catch(error) {
        console.error("Error with checking availability of property", error);
        return [];
      }
  }
}