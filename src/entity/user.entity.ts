import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class UserModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'varchar',
    name: 'title',
    length: 200,
    nullable: false,
    update: true,
    select: true,
    default: 'no title',
    unique: false,
  })
  title!: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role!: Role;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @VersionColumn()
  version!: number;

  @Column()
  @Generated('uuid')
  additionalId!: string;
}
