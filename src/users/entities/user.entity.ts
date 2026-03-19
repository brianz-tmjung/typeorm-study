/**
 * id: number
 * nickname: string
 *
 * email : string
 * password : string
 *
 * role: [RolesEnum.USER, RolesEnum.ADMIN]
 */

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RolesEnum } from '../const/role.const';

@Entity()
export class UsersModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
    unique: true,
  })
  //1) 유일무이한 값이될것
  nickname: string;
  @Column({})
  email: string;
  @Column()
  password: string;
  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;
}
