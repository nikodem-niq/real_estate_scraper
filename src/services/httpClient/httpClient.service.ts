import fetch, { Headers } from 'node-fetch';
import type { Response } from 'node-fetch';

class HttpClient {
    async get(url: string): Promise<string | []> {
      try {
        const headers : Headers = new Headers();
        headers.append('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        headers.append('Accept-Language', 'en-US,en;q=0.9');

        const response = await fetch(url, {
          headers: headers,
        });

        return response.text();
        
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return []
      }
    }
}

export default HttpClient;