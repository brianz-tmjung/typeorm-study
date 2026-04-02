import { UsersModel } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from 'src/common/entity/base.entity';

@Entity()
export class PostsModel extends BaseModel {
  //1) UsersModel과 연동(null이 될수없다)
  @ManyToOne(() => UsersModel, (user) => user.posts, {
    nullable: false,
  })
  author: UsersModel;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: 0 })
  likeCount: number;

  @Column({ default: 0 })
  commentCount: number;
}
