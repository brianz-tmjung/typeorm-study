import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersModel } from 'src/users/entities/user.entity';

export const User = createParamDecorator(
  (data: keyof UsersModel | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user = req.user as UsersModel;
    if (!user) {
      throw new InternalServerErrorException('request user가 없음');
    }
    if (data) {
      return user[data];
    }
    return user;
  },
);
