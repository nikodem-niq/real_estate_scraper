import fetch from 'node-fetch';
import { decodeData } from './helpers/httpHelpers';

class HttpClient {
    async get(url: string): Promise<any> {
      try {
        const response = await fetch(url);
        const data = await response.text();
        return data;
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        throw error;
      }
    }
}

export default HttpClient;