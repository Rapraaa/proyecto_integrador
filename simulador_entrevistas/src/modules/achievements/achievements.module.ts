import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './entities/achievement.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { User } from '../users/entities/user.entity';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import { UserAchievementsService } from './services/user-achievements.service';
import { UserAchievementsController } from './controllers/user-achievements.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Achievement, UserAchievement, User])],
  controllers: [AchievementsController, UserAchievementsController],
  providers: [AchievementsService, UserAchievementsService],
  exports: [AchievementsService, UserAchievementsService],
})
export class AchievementsModule {}
