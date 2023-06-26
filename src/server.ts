import express from 'express';
import {engine}  from 'express-handlebars';
import { Scraper } from './services/_';
import { IPropertyScraper, ICsvHelper } from './constants/interfaces';
import { CsvHelper } from './helpers/csvHelper';
import path from 'path';
import { Logger } from './helpers/loggerHelper';
import bodyParser from 'body-parser';

export class Server {
  private app: express.Application;
  private excelHelper : ICsvHelper;

  constructor() {
    this.app = express();
    this.excelHelper = new CsvHelper();

    this.setupMiddleware();
    this.setupRoutes();
  }

  private logHelper = new Logger('server' as string);

  private setupMiddleware(): void {
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.engine('handlebars', engine({defaultLayout: 'main', layoutsDir: path.join(__dirname, 'views/layouts')}));
    this.app.set('view engine', 'handlebars');
    this.app.set('views', path.join(__dirname, 'views'));
  }

  private setupRoutes(): void {
    this.app.post('/fetchProperties', async (req, res) => {
      try{
        const scraperName = req.body.scraperName;
        const city = req.body.city;
        const type = req.body.type;
        const ownerTypeSearching = req.body.ownerTypeSearching;
        const minPrice = req.body.minPrice;
        const maxPrice = req.body.maxPrice;
        const minArea = req.body.minArea;
        const maxArea = req.body.maxArea;
        const scraper : IPropertyScraper = Scraper.createScraper(scraperName, {type: type, city: city ? city : '', priceLow: minPrice ? minPrice : '', priceHigh: maxPrice ? maxPrice : '', areaLow: minArea ? minArea : '', areaHigh: maxArea ? maxArea : '', ownerTypeSearching: ownerTypeSearching ? ownerTypeSearching : ''});
        this.logHelper.log(`ROZPOCZYNAM SCRAPOWANIE ${scraperName}`, "log");
        await scraper.initScrape();
        // read properties
        res.render('scraping-status');
      } catch(error) {
        this.logHelper.log(error as string, "error");
        res.json(error)
      }
    });

    this.app.post('/rescrapeProperties', (req, res) => {
      try {
        const scraper = new Scraper();
        const fileName = req.body.fileName;
        scraper.rescrapePropertiesFromExcel(fileName)
        // Logika przetwarzania żądania ponownego scrapowania
        res.render('scraping-status');
      } catch(error) {
        this.logHelper.log(error as string, "error");
        res.json(error)

      }
    });

    this.app.get('/dashboard', (req, res) => {
      // Logika renderowania strony dashboard lub panelu admina
      res.render('dashboard');
    });
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  }
}
