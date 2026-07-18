import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { SeniorityLevel } from './entities/seniority-level.entity';
import { JobRole } from './entities/job-role.entity';
import { InterviewType } from './entities/interview-type.entity';
import { DifficultyLevel } from './entities/difficulty-level.entity';
import { Company } from './entities/company.entity';
import { RolesService } from './services/roles.service';
import { SeniorityLevelsService } from './services/seniority-levels.service';
import { JobRolesService } from './services/job-roles.service';
import { InterviewTypesService } from './services/interview-types.service';
import { DifficultyLevelsService } from './services/difficulty-levels.service';
import { CompaniesService } from './services/companies.service';
import { RolesController } from './controllers/roles.controller';
import { SeniorityLevelsController } from './controllers/seniority-levels.controller';
import { JobRolesController } from './controllers/job-roles.controller';
import { InterviewTypesController } from './controllers/interview-types.controller';
import { DifficultyLevelsController } from './controllers/difficulty-levels.controller';
import { CompaniesController } from './controllers/companies.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      SeniorityLevel,
      JobRole,
      InterviewType,
      DifficultyLevel,
      Company,
    ]),
  ],
  controllers: [
    RolesController,
    SeniorityLevelsController,
    JobRolesController,
    InterviewTypesController,
    DifficultyLevelsController,
    CompaniesController,
  ],
  providers: [
    RolesService,
    SeniorityLevelsService,
    JobRolesService,
    InterviewTypesService,
    DifficultyLevelsService,
    CompaniesService,
  ],
  exports: [
    RolesService,
    SeniorityLevelsService,
    JobRolesService,
    InterviewTypesService,
    DifficultyLevelsService,
    CompaniesService,
  ],
})
export class CatalogsModule {}
