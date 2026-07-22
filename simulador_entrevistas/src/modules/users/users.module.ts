import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '../catalogs/entities/role.entity';
import { SeniorityLevel } from '../catalogs/entities/seniority-level.entity';
import { AdminBootstrapService } from './admin-bootstrap.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, SeniorityLevel])],
  controllers: [UsersController],
  providers: [UsersService, AdminBootstrapService],
  exports: [UsersService],
})
export class UsersModule {}
