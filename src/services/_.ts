import cheerio from 'cheerio';
import HttpClient from '../http-client';
import { IHttpClient } from '../constants/interfaces'
import { Property } from '../property/property';

export class Scraper extends Property {
  public Property : Property;
  public html: string = '';
  private httpClient: IHttpClient;

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


}