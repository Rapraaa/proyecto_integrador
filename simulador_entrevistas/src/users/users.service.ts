import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const UserExist = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (UserExist) {
      throw new BadRequestException('El correo electrónico ya está registrado');
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.userRepository.create({
      email: createUserDto.email,
      passwordHash: hash,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      seniorityLevel: createUserDto.seniorityLevel,
    });
    return await this.userRepository.save(newUser);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(updateUserDto.password, salt);
      user.passwordHash = hash;
    }

    const { password, ...datosAActualizar } = updateUserDto; //evitamos meter la contraseña sin hashear
    this.userRepository.merge(user, datosAActualizar);

    return await this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return await this.userRepository.remove(user);
  }
}
