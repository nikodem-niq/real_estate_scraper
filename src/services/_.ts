import cheerio from 'cheerio';
import HttpClient from '../http-client';
import { IHttpClient } from '../constants/interfaces'

export class Scraper {
  public html: string = '';
  private httpClient: IHttpClient;

  constructor() {
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

  // Dodaj inne metody do manipulacji DOM według potrzeb

  // Przykładowa metoda, która używa innej metody w klasie
  scrapeData(): void {
    const title = this.getElementText('h1');
    console.log('Page title:', title);
  }
}