import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Role } from '../catalogs/entities/role.entity';
import { RoleOptions } from './enums/user-roles.enum';

// Crea (o promueve) el primer administrador a partir de variables de entorno.
// Se ejecuta una sola vez al arrancar y es idempotente: si el admin ya existe,
// no hace nada. Evita tener que sembrar admins o tocar la BD a mano.
@Injectable()
export class AdminBootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminBootstrapService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    const email = this.configService.get<string>('ADMIN_EMAIL');
    const password = this.configService.get<string>('ADMIN_PASSWORD');
    if (!email || !password) return;

    const adminRole = await this.rolesRepository.findOneBy({
      name: RoleOptions.ADMIN,
    });
    if (!adminRole) {
      this.logger.warn(
        'No existe el rol "admin" en el catálogo; se omite el bootstrap del admin.',
      );
      return;
    }

    const existing = await this.userRepository.findOneBy({ email });
    if (existing) {
      if (existing.role?.name !== RoleOptions.ADMIN) {
        existing.role = adminRole;
        await this.userRepository.save(existing);
        this.logger.log(`Usuario ${email} promovido a administrador.`);
      }
      return;
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const admin = this.userRepository.create({
      email,
      passwordHash,
      firstName: 'Admin',
      role: adminRole,
    });
    await this.userRepository.save(admin);
    this.logger.log(`Administrador inicial creado: ${email}`);
  }
}
