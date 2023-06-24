import cheerio from 'cheerio';
import HttpClient from '../http-client';
import { IHttpClient } from '../constants/interfaces'
import { Property } from '../property/property';
import puppeteer, { Browser, Page } from 'puppeteer';

export class Scraper extends Property {
  public Property : Property;
  public html: string = '';
  private httpClient: IHttpClient;
  private browser: Browser | null = null;


  constructor() {
    super();
    this.Property = new Property();
    this.httpClient = new HttpClient();
  }

  
  public get _html() : string {
    return this.html;
  }

  
  public set _html(v : string) {
    this.html = v;
  }
  
  

  async fetchHtml(url: string): Promise<Response|string> {
    try {
      const response = await this.httpClient.get(url);
      return response as Response;
    } catch (error) {
      console.error(`Error fetching HTML from ${url}:`, error);
      throw error;
    }
  }

  async fetchHtmlWithPuppeteer(url: string) : Promise<string> {
    if(!this.browser) {
      throw new Error('Browser not launched. Call launchBrowser() first.');
    }
    const page = await this.browser.newPage();
    await page.goto(url);
    const html = await page.content();  
    return html;
  }

  getElementText(selector: string): string {
    const $ = cheerio.load(this.html);
    return $(selector).text();
  }

  async launchBrowser(options: Object): Promise<void> {
    try {
      this.browser = await puppeteer.launch(options);
    } catch (error) {
      console.error('Error launching browser:', error);
      throw error;
    }
  }

  async newBrowserPage(url: string): Promise<void> {
    try {
      if (!this.browser) {
        throw new Error('Browser not launched. Call launchBrowser() first.');
      }
      const page : Page = await this.browser.newPage()
      await page?.goto(url);
    } catch(error) {
      console.error('Error launching browser:', error);
      throw error;
    }
  }

  async getTextFromSelector(url: string, selector: string): Promise<string | null> {
    try {
      if (!this.browser) {
        throw new Error('Browser not launched. Call launchBrowser() first.');
      }

      const page: Page = await this.browser.newPage();
      await page.goto(url);

      const element = await page.$(selector);
      if (!element) {
        throw new Error(`Element with selector "${selector}" not found.`);
      }

      const text = await page.evaluate(el => el.textContent, element);
      await page.close();

      return text;
    } catch (error) {
      console.error(`Error getting text from selector "${selector}":`, error);
      return null;
    }
  }

  async getLastElementTextFromClass(url: string, className: string): Promise<string | null> {
    try {
      if (!this.browser) {
        throw new Error('Browser not launched. Call launchBrowser() first.');
      }
  
      const page: Page = await this.browser.newPage();
      await page.goto(url);
  
      const lastElementText = await page.$$eval(`.${className}`, elements => {
        const lastElement = elements[elements.length - 1];
        return lastElement ? lastElement.textContent : null;
      });
  
      await page.close();
  
      return lastElementText;
    } catch (error) {
      console.error(`Error getting last element text from class "${className}":`, error);
      return null;
    }
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }

  /**
   * 
   * @param scraperName
   * @param dataToRescrape 
   * @param logHelper 
   * @returns 
   */
  public async checkAvailabilityOfProperty(scraperName: string, dataToRescrape: any, logHelper: any) : Promise<Array<string>> {
    const unavailableProperties : Array<string> = [];
    try {
      
      if(dataToRescrape) {
        let propCounter: number = 0;
        for(const property of dataToRescrape) {
            // if(propCounter > 3) continue
            propCounter++;
            logHelper.log(`Re-scraping progress: ${Math.ceil(propCounter/dataToRescrape.length*100)}%`, "log")
            if(property !== null && typeof property === 'object' && 'text' in property) {
                const res = await this.fetchHtml(property.text) as Response;
                this._html = await res.text() as unknown as string;
                const actualUrl : string = res.url;
                if(actualUrl != property.text) {
                    unavailableProperties.push(property.text as string);
                }
            } else if(property !== null && typeof property === 'object' && 'formula' in property && property.formula && /HYPERLINK\("([^"]+)",\s*"[^"]+"\)/i.test(property.formula)) {
                const matchedHtml = property.formula.match(/HYPERLINK\("([^"]+)",\s*"[^"]+"\)/i);
                if(matchedHtml) {
                    
                    const res = await this.fetchHtml(matchedHtml[1] as string) as Response;
                    this._html = await res.text() as unknown as string;
                    const actualUrl : string = res.url;  
                    if(actualUrl != matchedHtml[1]) {
                        unavailableProperties.push(matchedHtml[1] as string);
                    }
                }
            } else {
                const res = await this.fetchHtml(property as string) as Response;
                this._html = await res.text() as unknown as string;
                const actualUrl : string = res.url;
                if(actualUrl != property) {
                    unavailableProperties.push(property as string);
                }
            }
        }
      }
    } catch(error) {
      logHelper.log(error as string, "error");
    }

    return unavailableProperties
  }
}