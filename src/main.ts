import { baseURL } from "./constants/config";
import { Morizon } from "./services/morizon";
import { Otodom } from "./services/otodom";
import { Server } from './server';

try {
    const server = new Server();
    server.start(3000);
} catch(error) {
    console.error(error)
}
