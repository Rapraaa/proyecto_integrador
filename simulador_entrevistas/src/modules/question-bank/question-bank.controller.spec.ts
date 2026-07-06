import { Test, TestingModule } from '@nestjs/testing';
import { QuestionBankController } from './question-bank.controller';
import { QuestionBankService } from './question-bank.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('QuestionBankController', () => {
  let controller: QuestionBankController;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionBankController],
      providers: [{ provide: QuestionBankService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();
    controller = module.get<QuestionBankController>(QuestionBankController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('findAll delega la consulta al servicio', async () => {
    const query = { page: 1, limit: 10 };
    mockService.findAll.mockResolvedValue({ data: [], meta: {} });
    await controller.findAll(query);
    expect(mockService.findAll).toHaveBeenCalledWith(query);
  });

  it('findOne delega el id al servicio', async () => {
    mockService.findOne.mockResolvedValue({ id: 'q-1' });
    await controller.findOne('q-1');
    expect(mockService.findOne).toHaveBeenCalledWith('q-1');
  });

  it('create delega el dto al servicio', async () => {
    const dto = {
      enunciado: '¿Qué es un closure?',
      interview_type: 'theoretical',
      technology: 'JavaScript',
      difficulty: 'medium',
    };
    mockService.create.mockResolvedValue({ id: 'q-1', ...dto });
    await controller.create(dto);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('update delega id y dto al servicio', async () => {
    const dto = { difficulty: 'hard' };
    mockService.update.mockResolvedValue({ id: 'q-1', ...dto });
    await controller.update('q-1', dto);
    expect(mockService.update).toHaveBeenCalledWith('q-1', dto);
  });

  it('remove delega el id al servicio', async () => {
    mockService.remove.mockResolvedValue({ id: 'q-1' });
    await controller.remove('q-1');
    expect(mockService.remove).toHaveBeenCalledWith('q-1');
  });
});
