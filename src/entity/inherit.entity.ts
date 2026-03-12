import {
  ChildEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@TableInheritance({
  column: {
    name: 'type',
  },
})
export class SingleBaseModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

@ChildEntity()
export class ComputerModel extends SingleBaseModel {
  @Column()
  barnd: string;
}
@ChildEntity()
export class AirPlaneModel extends SingleBaseModel {
  @Column()
  country: string;
}
