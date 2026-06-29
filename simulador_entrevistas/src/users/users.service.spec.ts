jest.mock('bcrypt', () => ({
  hash:    jest.fn(),
  compare: jest.fn(),
  genSalt: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { SeniorityLevels } from './enums/user-seniority.enum';
import * as bcrypt from 'bcrypt';

const USER_ID      = '33333333-3333-3333-3333-333333333333';
const NOT_FOUND_ID = '99999999-9999-9999-9999-999999999999';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    create:   jest.fn(),
    save:     jest.fn(),
    find:     jest.fn(),
    findOneBy: jest.fn(),
    merge:    jest.fn(),
    remove:   jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should throw BadRequestException if email already exists', async () => {
      mockUserRepository.findOneBy.mockResolvedValue({ id: USER_ID, email: 'ana@test.com' });
      const dto = { email: 'ana@test.com', password: 'plaintext', firstName: 'Ana', lastName: 'Perez', seniorityLevel: SeniorityLevels.JUNIOR };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should hash the password before saving', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);
      const hashedPwd = '$2b$10$hashedvalue';
      
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPwd);
      
      const expectedUser = { email: 'ana@test.com', passwordHash: hashedPwd };
      mockUserRepository.create.mockReturnValue(expectedUser);
      mockUserRepository.save.mockResolvedValue({ id: USER_ID, ...expectedUser });

      const dto = { email: 'ana@test.com', password: 'plaintext', firstName: 'Ana', lastName: 'Perez', seniorityLevel: SeniorityLevels.JUNIOR };
      const result = await service.create(dto);

      expect(result?.passwordHash).toBe(hashedPwd);
      expect(bcrypt.hash).toHaveBeenCalledWith('plaintext', 'salt');
    });
  });

  describe('findAll()', () => {
    it('should return all users', async () => {
      const mockUsers = [{ id: USER_ID, email: 'ana@test.com' }];
      mockUserRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();
      expect(result).toEqual(mockUsers);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should return user when it exists', async () => {
      const mockUser = { id: USER_ID, email: 'ana@test.com' };
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findOne(USER_ID);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: USER_ID });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(NOT_FOUND_ID)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('should call bcrypt.hash if password is being updated', async () => {
      const mockUser = { id: USER_ID, email: 'ana@test.com', passwordHash: '$2b$10$oldhash' };
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$newhash');
      mockUserRepository.save.mockResolvedValue({ ...mockUser, passwordHash: '$2b$10$newhash' });

      await service.update(USER_ID, { password: 'newpassword' });
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 'salt');
    });

    it('should merge update properties and save the user', async () => {
      const mockUser = { id: USER_ID, email: 'ana@test.com', firstName: 'Ana' };
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue({ ...mockUser, firstName: 'Ana Maria' });

      const updateDto = { firstName: 'Ana Maria' };
      const result = await service.update(USER_ID, updateDto);

      expect(mockUserRepository.merge).toHaveBeenCalledWith(mockUser, updateDto);
      expect(result.firstName).toBe('Ana Maria');
    });
  });

  describe('remove()', () => {
    it('should call repository.remove with the found user', async () => {
      const mockUser = { id: USER_ID, email: 'ana@test.com' };
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockUserRepository.remove.mockResolvedValue(mockUser);

      await service.remove(USER_ID);
      expect(mockUserRepository.remove).toHaveBeenCalledWith(mockUser);
    });
  });
});