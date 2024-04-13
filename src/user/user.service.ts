import { Injectable } from '@nestjs/common';
import type { User as TelegramUser } from 'node-telegram-bot-api';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getAllUsers() {
    return this.userRepository.find();
  }
  async saveUser(user: TelegramUser) {
    const userExists = await this.userRepository.findOne({
      where: { userId: user.id },
    });
    if (userExists) {
      return;
    }
    const dbUser = new User();
    dbUser.username = user.username;
    dbUser.firstName = user.first_name;
    dbUser.lastName = user.last_name;
    dbUser.userId = user.id;
    console.log({ dbUser });
    try {
      const result = await this.userRepository.save(dbUser);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }
}
