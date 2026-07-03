import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechCategory } from './entities/tech-category.entity';
import { Technology } from './entities/technology.entity';
import { UserTechnology } from './entities/user-technology.entity';

//Los CRUD de este módulo se implementan en BACK-10.
@Module({
  imports: [
    TypeOrmModule.forFeature([TechCategory, Technology, UserTechnology]),
  ],
})
export class TechnologiesModule {}
