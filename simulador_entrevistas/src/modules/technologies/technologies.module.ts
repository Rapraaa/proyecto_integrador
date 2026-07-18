import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechCategory } from './entities/tech-category.entity';
import { Technology } from './entities/technology.entity';
import { UserTechnology } from './entities/user-technology.entity';
import { TechCategoriesService } from './services/tech-categories.service';
import { TechCategoriesController } from './controllers/tech-categories.controller';

//El CRUD de technologies y user_technologies toca implementarlo en BACK-10.
@Module({
  imports: [
    TypeOrmModule.forFeature([TechCategory, Technology, UserTechnology]),
  ],
  controllers: [TechCategoriesController],
  providers: [TechCategoriesService],
  exports: [TechCategoriesService],
})
export class TechnologiesModule {}
