import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

interface CreateSessionDto {
  name: string;
}

interface SendMessageDto {
  sessionId: string;
  phone: string;
  text: string;
}

@Injectable()
export class WahaService {
  private readonly client: AxiosInstance;
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly logger = new Logger(WahaService.name);

  constructor() {
    this.baseUrl = process.env.WAHA_BASE || 'http://localhost:9999';
    this.apiKey = process.env.WAHA_API_KEY || 'testkey';

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'X-Api-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  private handleError(error: any, context: string) {
    this.logger.error(`[WAHA] ${context} failed:`, error?.response?.data || error.message);
    throw new InternalServerErrorException(`WAHA ${context} failed`);
  }

  async createSession(data: { name: string }) {
    try {
      const res = await this.client.post('/api/sessions', data);
      return res.data;
    } catch (err: any) {
     
      const status = err.response?.status;
      const body = err.response?.data;
      if (status === 422 && body?.message?.includes('already exists')) {
        this.logger.warn(`[WAHA] session already exists: ${data.name} — reusing`);
       
        return { id: data.name, status: 'CONNECTED', name: data.name, _existing: true };
      }
  
      
      if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
        this.logger.warn('[WAHA MOCK] WAHA unreachable - returning demo session');
        return { id: 'demo-session', status: 'CONNECTED', name: data.name, mock: true };
      }
  
      this.handleError(err, 'createSession');
    }
  }
  
  

  async startSession(sessionId: string) {
    try {
      const res = await this.client.post(`/api/sessions/${sessionId}/start`);
      return res.data;
    } catch (err) {
      this.handleError(err, 'startSession');
    }
  }

  async stopSession(sessionId: string) {
    try {
      const res = await this.client.post(`/api/sessions/${sessionId}/stop`);
      return res.data;
    } catch (err) {
      this.handleError(err, 'stopSession');
    }
  }

  async listSessions() {
    // try {
    //   const res = await this.client.get('/api/sessions');
    //   return res.data;
    // } catch (err) {
    //   this.handleError(err, 'listSessions');
    // }

    //DEMO
    return [
        { id: 'demo-session', status: 'CONNECTED', name: 'Demo Session (dummy)' }
      ];

  }

  async sendMessage({ sessionId, phone, text }: { sessionId: string; phone: string; text: string }) {
    try {
  
      if ((process.env.WAHA_BASE || '').includes('localhost') || process.env.WAHA_MOCK === 'true') {
        this.logger.warn(`[WAHA MOCK] send to ${phone}: ${text}`);
        return { id: `mock-${Date.now()}`, phone, text, status: 'SENT', mock: true };
      }
   
      const res = await this.client.post('/api/messages', { phone, text });
      return res.data;
    } catch (err) {
      
      if (err.response?.status === 404) {
        this.logger.warn('[WAHA] endpoint /api/messages not found — falling back to mock');
        return { id: `mock-${Date.now()}`, phone, text, status: 'SENT', mock: true };
      }
      this.handleError(err, 'sendMessage');
    }
  }
  
}
