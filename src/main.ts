import { baseURL } from "./constants/config";
import { Morizon } from "./services/morizon";
import { Otodom } from "./services/otodom";
import { Server } from './server';

const helperClass = new Otodom({city: 'xyz', type: 'rent', ownerTypeSearching: 'PRIVATE', areaLow: 0, areaHigh: 0, priceLow: 0, priceHigh: 0});

const server = new Server();
server.start(3000);
