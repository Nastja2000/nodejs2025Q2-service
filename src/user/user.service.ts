import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { User, IUserResponse } from './entities/user.entity';
import { validate as validateUUID } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>
  ) {}

  async getAll(): Promise<IUserResponse[]> {
    return this.usersRepo.find();
  }

  async getById(id: string): Promise<IUserResponse> {
    if (!validateUUID(id)) {
      throw new BadRequestException('User Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the User's Id. It should be like UUID v4",
      });
    }
    const existingUser: User = await this.usersRepo.findOne({where: {id}});

    if (!existingUser) {
      throw new NotFoundException("User with this Id isn't exist", {
        cause: new Error(),
        description:
          "The User with this Id isn't exist. Please, check the id that you enter",
      });
    }
 
    return existingUser;
  }

  async create(dto: CreateUserDto): Promise<IUserResponse> {
    const {login, password} = dto;

    if (!dto.login || !dto.password) {
      throw new BadRequestException('Required fields are not entered', {
        cause: new Error(),
        description:
          'Required field(s) is(are) missing. Check if login and password are entered and try again',
      });
    }

    const existingUser: User = await this.usersRepo.findOne({where: {login}});

    if (existingUser) {
      throw new ConflictException('User with this login already exist.', {
        cause: new Error(),
        description:
          'User with this login already exist. Check if login is entered correctly and try again',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = this.usersRepo.create({
        login: login, 
        password: hashedPassword,
        version: 1
      });

    return this.usersRepo.save(newUser);
  }

  async updatePassword(dto: UpdatePasswordDto, id: string): Promise<IUserResponse> {
    const {oldPassword, newPassword} = dto;
    if (!validateUUID(id)) {
      throw new BadRequestException('User Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the User's Id. It should be like UUID v4",
      });
    }
    const existingUser: User = await this.usersRepo.findOne({where: {id}});
    if (!existingUser) {
      throw new NotFoundException("User with this Id isn't exist", {
        cause: new Error(),
        description:
          "The User with this Id isn't exist. Please, check the id that you enter",
      });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, existingUser.password);

    if (isPasswordValid) {
      throw new ForbiddenException('The old password is wrong', {
        cause: new Error(),
        description: 'The old password is wrong. Please, try again.',
      });
    }

    existingUser.password = await bcrypt.hash(newPassword, 10);
    existingUser.version++;

    return this.usersRepo.save(existingUser);
  }

  async delete(id: string): Promise<void> {
    if (!validateUUID(id)) {
      throw new BadRequestException('User Id is invalid', {
        cause: new Error(),
        description:
          "The wrong format of the User's Id. It should be like UUID v4",
      });
    }

    const deletionResult = await this.usersRepo.delete(id);

    if (deletionResult.affected === 0) {
      throw new NotFoundException("User with this Id isn't exist", {
        cause: new Error(),
        description:
          "The User with this Id isn't exist. Please, check the id that you enter",
      });
    }
  }
}
