import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { UserModel } from './entity/user.entity';
import { StudentModel, TeacherModel } from './entity/person.entity';
import { UsersModel } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'typeormstudy',
      entities: [UserModel, UsersModel, TeacherModel, StudentModel],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([UserModel]),
    PostsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
