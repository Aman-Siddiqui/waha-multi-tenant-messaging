import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WahaSession } from './waha-session.entity';
import { WahaService } from './waha.service';

@Injectable()
export class WahaSessionsService {
  constructor(
    @InjectRepository(WahaSession)
    private readonly sessionRepo: Repository<WahaSession>,
    private readonly wahaService: WahaService,
  ) {}

  async createAndStartSession(tenantId: string, name: string) {
    
    const apiRes = await this.wahaService.createSession({ name });
    const externalId = apiRes.id || apiRes.sessionId || name;
  

    
    const session = this.sessionRepo.create({
      tenant_id: tenantId,
      external_session_id: externalId,
      status: apiRes.status || 'CREATED',
      metadata: apiRes,
    });
    await this.sessionRepo.save(session);


    try {
      await this.wahaService.startSession(session.external_session_id);
      session.status = 'CONNECTED';
      await this.sessionRepo.save(session);

      if (!apiRes.mock && !apiRes._existing) {
        try { await this.wahaService.startSession(externalId); session.status = 'CONNECTED'; await this.sessionRepo.save(session); }
        catch (e) { session.status = 'FAILED'; await this.sessionRepo.save(session); }
      }
      
    } catch (err) {
      session.status = 'FAILED';
      await this.sessionRepo.save(session);
    }

    return session;
  }

  async listSessions(tenantId: string) {
    return this.sessionRepo.find({
      where: { tenant_id: tenantId },
      order: { created_at: 'DESC' },
    });
  }

  async stopSession(tenantId: string, id: string) {
    const session = await this.sessionRepo.findOne({ where: { id, tenant_id: tenantId } });
    if (!session) throw new NotFoundException('Session not found');

    await this.wahaService.stopSession(session.external_session_id);
    session.status = 'STOPPED';
    return this.sessionRepo.save(session);
  }
}
