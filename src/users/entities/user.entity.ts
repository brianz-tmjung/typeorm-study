/**
 * id: number
 * nickname: string
 *
 * email : string
 * password : string
 *
 * role: [RolesEnum.USER, RolesEnum.ADMIN]
 */

import { Column, Entity, OneToMany } from 'typeorm';
import { RolesEnum } from '../const/role.const';
import { PostsModel } from 'src/posts/entities/post.entity';
import { BaseModel } from 'src/common/entity/base.entity';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { emailValidationMessage } from 'src/common/validation-message/email-validation.message';

@Entity()
@Exclude()
export class UsersModel extends BaseModel {
  @Column({
    length: 20,
    unique: true,
  })
  //1) 유일무이한 값이될것
  @IsString({ message: stringValidationMessage })
  @Length(1, 20, { message: lengthValidationMessage })
  @Expose()
  nickname: string;

  @Column({})
  @IsEmail({}, { message: emailValidationMessage })
  @Expose()
  email: string;

  @Column()
  @IsString({ message: stringValidationMessage })
  @Length(3, 100, { message: lengthValidationMessage })
  @Exclude({ toPlainOnly: true })
  password: string;
  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;
  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[]; //user에선 모든 posts들을 가질수있따.

  @Expose()
  get showMe() {
    return `EE${this.email}EE!!!!!!!!!!!!!!!!`;
  }
}
