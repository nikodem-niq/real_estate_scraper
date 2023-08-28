// import moviesController from '../src/controllers/movies/movies.controller';
import app from '../../app';
import request from 'supertest';

// env for tests purposes
process.env.NODE_ENV = 'test';
const timeoutForScrapingTests = 1000 * 50; // 50 secs

describe('Otodom routing', () => {
    const mockedOtodomSettingsObject = {
        type: 'wynajem',
        propertyType: 'mieszkanie',
        voivoideship: 'dolnoslaskie',
        city: 'wroclaw',
        priceLow: 4950,
        priceHigh: 5000,
        areaLow: 20,
        areaHigh: 60
        
    }

    test('POST /properties/otodom-scrap should scrap data', async () => {
      
      const response = await request(app).post('/properties/otodom-scrap').send(
        mockedOtodomSettingsObject
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        status: 'scrapped',
      }));
    }, timeoutForScrapingTests)

    test('POST /properties/otodom-scrap should start scraping (incorrect body)', async () => {
        const mockedOtodomSettingsWhichShouldFail = {
            a: 1,
            b: 2,
            c: 3,
            d: 4
        }

        const response = await request(app).post('/properties/otodom-scrap').send(
          mockedOtodomSettingsWhichShouldFail
        );
        expect(response.status).toBe(400);
        expect(response.body).not.toEqual(expect.objectContaining(mockedOtodomSettingsWhichShouldFail));
        expect(response.body.error.details[0].message).toEqual('type is required');
        expect(response.body.error.details[1].message).toEqual('propertyType is required');
        expect(response.body.error.details[2].message).toEqual('voivoideship is required');
        expect(response.body.error.details[3].message).toEqual('city is required');
        expect(response.body.error.details[4].message).toEqual('a is not allowed');
        expect(response.body.error.details[5].message).toEqual('b is not allowed');
        expect(response.body.error.details[6].message).toEqual('c is not allowed');
        expect(response.body.error.details[7].message).toEqual('d is not allowed');
    }, timeoutForScrapingTests)
})