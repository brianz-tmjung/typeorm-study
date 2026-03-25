import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
  ) {}
  async createUser(nickname: string, email: string, password: string) {
    const nicknameExists = await this.usersRepository.exists({
      where: { nickname },
    });

    if (nicknameExists) {
      throw new BadRequestException('이미 존재하는 닉네임입니다.');
    }

    const emailExists = await this.usersRepository.exists({
      where: { email },
    });

    if (emailExists) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    const user = this.usersRepository.create({
      nickname,
      email,
      password,
    });
    const newuser = await this.usersRepository.save(user);
    return newuser;
  }

  async getAllUsers() {
    return await this.usersRepository.find();
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }
}
