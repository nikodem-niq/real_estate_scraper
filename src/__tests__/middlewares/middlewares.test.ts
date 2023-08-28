import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { schemaValidator } from '../../middlewares/schemaValidator'; 
import schemas from '../../schemas/schemas'; 

const app = express();

app.use(express.json());

app.post('/test', schemaValidator('otodomRequestSchema'), (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json(req.body);
});

describe('Schema validator middleware', () => {
  it('should pass validation with valid data (otodom schema)', async () => {
    const otodomTestSchema = {
        type: 'wynajem',
        propertyType: 'mieszkanie',
        voivoideship: 'dolnoslaskie',
        city: 'wroclaw',
        priceLow: 2000,
      }
    const response = await request(app)
      .post('/test')
      .send(otodomTestSchema);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual(expect.objectContaining(otodomTestSchema));
  });

  it('should return 400 with invalid data', async () => {
    const response = await request(app)
      .post('/test')
      .send({
        a: 1,
        b: 2,
        type: 'aaaa',
        priceLow: "a"
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('status', 'error');
  });

  it('should have a valid otodom schema', async () => {
    const result = schemas['otodomRequestSchema'].validate({
        type: 'wynajem',
        propertyType: 'mieszkanie',
        voivoideship: 'dolnoslaskie',
        city: 'wroclaw',
        priceLow: 2000,
    });

    expect(result.error).toBeUndefined();
  });

  it('should catch invalid otodom schema', async () => {
    const result = schemas['otodomRequestSchema'].validate({
        type: 'wynajemm',
        propertyType: 'mieszkanieeee',
        voivoideshipp: 'dolnoslaskie',
        cityy: 'wroclaw',
        priceLow: "",
    });

    expect(result.error?.details[0]?.message).toEqual('"type" must be one of [sprzedaz, wynajem]');
    expect(result.error).toBeDefined();
  });
});