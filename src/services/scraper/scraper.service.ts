import { launch, Browser, BrowserConnectOptions } from "puppeteer";
import HttpClient from "../httpClient/httpClient.service";
import type { Response } from 'node-fetch';


export class Scraper {
    private browser: Browser | null = null;
    private httpClient : HttpClient = new HttpClient;

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
            return [];
        }
      }

    protected async fetchHtml(url: string): Promise<Response|[]> {
        try {
            const response = await this.httpClient.get(url);
            return response as Response;
        } catch (error) {
            console.error(`Error fetching HTML from ${url}:`, error);
            return [];
        }
    }
}