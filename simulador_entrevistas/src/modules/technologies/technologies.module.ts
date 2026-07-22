import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechCategory } from './entities/tech-category.entity';
import { Technology } from './entities/technology.entity';
import { UserTechnology } from './entities/user-technology.entity';
import { TechCategoriesService } from './services/tech-categories.service';
import { TechCategoriesController } from './controllers/tech-categories.controller';
import { TechnologiesService } from './services/technologies.service';
import { TechnologiesController } from './controllers/technologies.controller';

//El CRUD de user_technologies queda pendiente en BACK-10.
@Module({
  imports: [
    TypeOrmModule.forFeature([TechCategory, Technology, UserTechnology]),
  ],
  controllers: [TechCategoriesController, TechnologiesController],
  providers: [TechCategoriesService, TechnologiesService],
  exports: [TechCategoriesService, TechnologiesService],
})
export class TechnologiesModule {}
