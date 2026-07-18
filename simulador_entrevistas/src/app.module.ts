import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiModule } from './modules/ai/ai.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { InterviewsModule } from './modules/interviews/interviews.module';
import { CatalogsModule } from './modules/catalogs/catalogs.module';
import { TechnologiesModule } from './modules/technologies/technologies.module';
import { SurveysModule } from './modules/surveys/surveys.module';
import { PromptsModule } from './modules/prompts/prompts.module';
import { AuditModule } from './modules/audit/audit.module';
import { AchievementsModule } from './modules/achievements/achievements.module';
import { QuestionBankModule } from './modules/question-bank/question-bank.module';
import { AiLogsModule } from './modules/ai-logs/ai-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        //carga todas las entidades registradas con forFeature en los módulos
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    UsersModule,
    AiModule,
    AuthModule,
    InterviewsModule,
    CatalogsModule,
    TechnologiesModule,
    SurveysModule,
    PromptsModule,
    AuditModule,
    AchievementsModule,
    QuestionBankModule,
    AiLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
