import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { paginate, PaginatedResult } from '../../../common/pagination/paginate';
import { AuditLog } from '../entities/audit-log.entity';

export interface RegistroDeAuditoria {
  adminId?: string | null;
  targetUserId?: string | null;
  action: string;
  reason?: string | null;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

  async registrar(datos: RegistroDeAuditoria): Promise<void> {
    try {
      const registro = this.auditRepository.create({
        admin: datos.adminId ? { id: datos.adminId } : null,
        targetUser: datos.targetUserId ? { id: datos.targetUserId } : null,
        action: datos.action,
        reason: datos.reason ?? null,
      });
      await this.auditRepository.save(registro);
    } catch (error) {
      this.logger.error(
        `No se pudo registrar la acción "${datos.action}" en la auditoría`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResult<AuditLog>> {
    return await paginate(this.auditRepository, query, {
      searchFields: ['action'],
      sortableFields: ['createdAt', 'action'],
      relations: { admin: true, targetUser: true },
    });
  }

  async findOne(id: string): Promise<AuditLog> {
    const registro = await this.auditRepository.findOne({
      where: { id },
      relations: { admin: true, targetUser: true },
    });
    if (!registro) {
      throw new NotFoundException(`Registro de auditoría ${id} no encontrado`);
    }
    return registro;
  }
}
