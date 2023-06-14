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

  async fetchHtml(url: string): Promise<void> {
    try {
      this.html = await this.httpClient.get(url);
    } catch (error) {
      console.error(`Error fetching HTML from ${url}:`, error);
      throw error;
    }
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
}