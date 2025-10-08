import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('health')
  getHealth() {
    return { status: 'OK', service: 'ai-waha-api' };
  }

  @Get('ready')
  async getReady() {
    const dbStatus = await this.healthService.checkDatabase();
    return { status: 'OK', db: dbStatus };
  }
}
