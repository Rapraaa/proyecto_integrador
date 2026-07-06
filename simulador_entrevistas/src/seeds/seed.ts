import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { AppModule } from '../app.module';
import { Role } from '../modules/catalogs/entities/role.entity';
import { SeniorityLevel } from '../modules/catalogs/entities/seniority-level.entity';
import { JobRole } from '../modules/catalogs/entities/job-role.entity';
import { InterviewType } from '../modules/catalogs/entities/interview-type.entity';
import { DifficultyLevel } from '../modules/catalogs/entities/difficulty-level.entity';
import { Company } from '../modules/catalogs/entities/company.entity';
import { TechCategory } from '../modules/technologies/entities/tech-category.entity';
import { Technology } from '../modules/technologies/entities/technology.entity';
import { EvaluationCriterion } from '../modules/prompts/entities/evaluation-criterion.entity';
import { PromptTemplate } from '../modules/prompts/entities/prompt-template.entity';
import { Achievement } from '../modules/achievements/entities/achievement.entity';
import { Survey } from '../modules/surveys/entities/survey.entity';
import { SurveyQuestion } from '../modules/surveys/entities/survey-question.entity';
import { SurveyOption } from '../modules/surveys/entities/survey-option.entity';
import {
  Question,
  QuestionDocument,
} from '../modules/question-bank/schemas/question.schema';
import { AiLog, AiLogDocument } from '../modules/ai-logs/schemas/ai-log.schema';

//inserta solo lo que no existe (idempotente: se puede correr N veces)
async function seedByName<T extends ObjectLiteral & { name: string }>(
  repository: Repository<T>,
  items: Partial<T>[],
  label: string,
) {
  let inserted = 0;
  for (const item of items) {
    const exists = await repository.findOneBy({
      name: item.name,
    } as never);
    if (!exists) {
      await repository.save(repository.create(item as never));
      inserted++;
    }
  }
  console.log(`  ${label}: ${inserted} insertados (${items.length} totales)`);
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });
  const dataSource = app.get(DataSource);

  console.log('Sembrando catálogos base (PostgreSQL)...');

  await seedByName(
    dataSource.getRepository(Role),
    [
      { name: 'user', description: 'Postulante que practica entrevistas' },
      { name: 'admin', description: 'Gestor del sistema' },
    ],
    'roles',
  );

  await seedByName(
    dataSource.getRepository(SeniorityLevel),
    [
      { name: 'trainee', sortOrder: 1 },
      { name: 'junior', sortOrder: 2 },
      { name: 'mid', sortOrder: 3 },
      { name: 'senior', sortOrder: 4 },
      { name: 'lead', sortOrder: 5 },
    ],
    'seniority_levels',
  );

  await seedByName(
    dataSource.getRepository(JobRole),
    [
      { name: 'backend' },
      { name: 'frontend' },
      { name: 'fullstack' },
      { name: 'mobile' },
      { name: 'devops' },
      { name: 'data' },
    ],
    'job_roles',
  );

  await seedByName(
    dataSource.getRepository(InterviewType),
    [
      { name: 'technical', description: 'Entrevista técnica con código' },
      { name: 'theoretical', description: 'Entrevista teórica conceptual' },
    ],
    'interview_types',
  );

  await seedByName(
    dataSource.getRepository(DifficultyLevel),
    [
      { name: 'easy', sortOrder: 1 },
      { name: 'medium', sortOrder: 2 },
      { name: 'hard', sortOrder: 3 },
    ],
    'difficulty_levels',
  );

  await seedByName(
    dataSource.getRepository(Company),
    [
      { name: 'Startup Tech', industry: 'startup' },
      { name: 'Banco Nacional', industry: 'banca' },
      { name: 'Consultora Global', industry: 'consultoría' },
      { name: 'BigTech Corp', industry: 'big tech' },
    ],
    'companies',
  );

  await seedByName(
    dataSource.getRepository(TechCategory),
    [
      { name: 'language' },
      { name: 'framework' },
      { name: 'database' },
      { name: 'devops' },
    ],
    'tech_categories',
  );

  //technologies necesita la FK a su categoría, no entra en seedByName directo
  const techCategoryRepo = dataSource.getRepository(TechCategory);
  const technologyRepo = dataSource.getRepository(Technology);
  const techsByCategory: Record<string, string[]> = {
    language: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go'],
    framework: ['NestJS', 'React', 'Angular', 'Express', 'Spring Boot'],
    database: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis'],
    devops: ['Docker', 'Kubernetes', 'GitHub Actions', 'Nginx'],
  };
  let techsInserted = 0;
  for (const [categoryName, techs] of Object.entries(techsByCategory)) {
    const category = await techCategoryRepo.findOneBy({ name: categoryName });
    if (!category) continue;
    for (const name of techs) {
      const exists = await technologyRepo.findOneBy({ name });
      if (!exists) {
        await technologyRepo.save(technologyRepo.create({ name, category }));
        techsInserted++;
      }
    }
  }
  console.log(`  technologies: ${techsInserted} insertadas`);

  await seedByName(
    dataSource.getRepository(EvaluationCriterion),
    [
      { name: 'claridad', weight: 2 },
      { name: 'correctitud', weight: 3 },
      { name: 'complejidad', weight: 2 },
      { name: 'comunicacion', weight: 1 },
      { name: 'buenas_practicas', weight: 2 },
    ],
    'evaluation_criteria',
  );

  await seedByName(
    dataSource.getRepository(Achievement),
    [
      {
        name: 'primera_entrevista',
        description: 'Completaste tu primera simulación',
        icon: '🎯',
      },
      {
        name: 'cinco_entrevistas',
        description: 'Completaste 5 simulaciones',
        icon: '🔥',
      },
      {
        name: 'score_80',
        description: 'Obtuviste un puntaje mayor a 80',
        icon: '🏆',
      },
    ],
    'achievements',
  );

  //prompt_templates con FK a interview_types
  const promptRepo = dataSource.getRepository(PromptTemplate);
  const interviewTypeRepo = dataSource.getRepository(InterviewType);
  const technicalType = await interviewTypeRepo.findOneBy({
    name: 'technical',
  });
  const theoreticalType = await interviewTypeRepo.findOneBy({
    name: 'theoretical',
  });
  const promptTemplates = [
    {
      name: 'entrevistador_tecnico_base',
      content:
        'Actúa como un reclutador técnico y entrevistador de software senior ultra riguroso. Evalúa candidatos simulando una entrevista técnica real con desafíos de código. Ve directo al grano, tono profesional y desafiante.',
      interviewType: technicalType,
    },
    {
      name: 'entrevistador_teorico_base',
      content:
        'Actúa como un entrevistador de software senior enfocado en conceptos teóricos. Haz preguntas conceptuales precisas, sin pedir código. Tono profesional y riguroso.',
      interviewType: theoreticalType,
    },
  ];
  let promptsInserted = 0;
  for (const template of promptTemplates) {
    const exists = await promptRepo.findOneBy({ name: template.name });
    if (!exists) {
      await promptRepo.save(promptRepo.create(template));
      promptsInserted++;
    }
  }
  console.log(`  prompt_templates: ${promptsInserted} insertados`);

  //encuesta inicial de contextualización (RF-01)
  const surveyRepo = dataSource.getRepository(Survey);
  const questionRepo = dataSource.getRepository(SurveyQuestion);
  const optionRepo = dataSource.getRepository(SurveyOption);
  const surveyTitle = 'Encuesta inicial de contextualización';
  let survey = await surveyRepo.findOneBy({ title: surveyTitle });
  if (!survey) {
    survey = await surveyRepo.save(
      surveyRepo.create({
        title: surveyTitle,
        description:
          'Recolecta el perfil del usuario para que la IA adapte tono y nivel',
      }),
    );
    const questions: {
      questionText: string;
      questionType: string;
      sortOrder: number;
      options: string[];
    }[] = [
      {
        questionText: '¿Cuál es tu situación académica actual?',
        questionType: 'single_choice',
        sortOrder: 1,
        options: ['Estudiante', 'Egresado', 'Autodidacta', 'Profesional'],
      },
      {
        questionText: '¿Cuántos años de experiencia tienes programando?',
        questionType: 'single_choice',
        sortOrder: 2,
        options: ['Menos de 1', '1 a 3', '3 a 5', 'Más de 5'],
      },
      {
        questionText: '¿Qué esperas mejorar con la simulación?',
        questionType: 'text',
        sortOrder: 3,
        options: [],
      },
    ];
    for (const q of questions) {
      const question = await questionRepo.save(
        questionRepo.create({
          survey,
          questionText: q.questionText,
          questionType: q.questionType,
          sortOrder: q.sortOrder,
        }),
      );
      for (let i = 0; i < q.options.length; i++) {
        await optionRepo.save(
          optionRepo.create({
            question,
            optionText: q.options[i],
            sortOrder: i + 1,
          }),
        );
      }
    }
    console.log('  surveys: encuesta inicial creada con preguntas y opciones');
  } else {
    console.log('  surveys: la encuesta inicial ya existe');
  }

  console.log('Sembrando colecciones (MongoDB)...');

  const questionModel = app.get<Model<QuestionDocument>>(
    getModelToken(Question.name),
  );
  const bankQuestions = [
    {
      enunciado: '¿Qué es el event loop de Node.js y cómo funciona?',
      interview_type: 'theoretical',
      technology: 'JavaScript',
      difficulty: 'medium',
      tags: ['async', 'runtime'],
    },
    {
      enunciado:
        'Implementa una función que invierta un string sin usar reverse().',
      interview_type: 'technical',
      technology: 'JavaScript',
      difficulty: 'easy',
      tags: ['algoritmos', 'strings'],
    },
    {
      enunciado:
        '¿Qué diferencia hay entre una relación 1:N y una N:M en SQL? Da un ejemplo de cada una.',
      interview_type: 'theoretical',
      technology: 'PostgreSQL',
      difficulty: 'easy',
      tags: ['sql', 'modelado'],
    },
    {
      enunciado:
        'Diseña un endpoint REST paginado para listar usuarios y explica tus decisiones.',
      interview_type: 'technical',
      technology: 'NestJS',
      difficulty: 'hard',
      tags: ['api', 'rest', 'paginacion'],
    },
  ];
  let bankInserted = 0;
  for (const q of bankQuestions) {
    const exists = await questionModel.findOne({ enunciado: q.enunciado });
    if (!exists) {
      await questionModel.create(q);
      bankInserted++;
    }
  }
  console.log(`  question_bank: ${bankInserted} preguntas insertadas`);

  //materializa la colección ai_logs aunque todavía no tenga documentos
  const aiLogModel = app.get<Model<AiLogDocument>>(getModelToken(AiLog.name));
  await aiLogModel.createCollection();
  console.log('  ai_logs: colección creada/verificada');

  await app.close();
  console.log('Seed completado.');
}

bootstrap().catch((error) => {
  console.error('Error ejecutando el seed:', error);
  process.exit(1);
});
