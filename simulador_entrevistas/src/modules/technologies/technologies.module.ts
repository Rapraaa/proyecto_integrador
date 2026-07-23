import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechCategory } from './entities/tech-category.entity';
import { Technology } from './entities/technology.entity';
import { UserTechnology } from './entities/user-technology.entity';
import { TechCategoriesService } from './services/tech-categories.service';
import { TechCategoriesController } from './controllers/tech-categories.controller';
import { TechnologiesService } from './services/technologies.service';
import { TechnologiesController } from './controllers/technologies.controller';
import { UserTechnologiesService } from './services/user-technologies.service';
import { UserTechnologiesController } from './controllers/user-technologies.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TechCategory, Technology, UserTechnology]),
  ],
  controllers: [
    TechCategoriesController,
    TechnologiesController,
    UserTechnologiesController,
  ],
  providers: [
    TechCategoriesService,
    TechnologiesService,
    UserTechnologiesService,
  ],
  exports: [
    TechCategoriesService,
    TechnologiesService,
    UserTechnologiesService,
  ],
})
export class TechnologiesModule {}