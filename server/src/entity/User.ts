import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'

import { Post } from './Post'
import { Post_comment } from './Post_comment'
import { Chat_message } from './Chat_message'
import { Post_like } from './Post_like'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: true })
  email!: string

  @Column({ nullable: true })
  password!: string

  @Column({ nullable: true })
  name!: string

  @Column()
  nickname!: string

  @Column({ nullable: true })
  mobile!: string

  @Column()
  signupType!: string

  @Column({ nullable: true })
  kakaoId!: string

  @Column({
    type: 'text',
    nullable: true
})
emailToken!: string | null;

  @Column({ nullable: true })
  avatarRef!: string

  @CreateDateColumn({ name: 'createdAt' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt!: Date

  /* 관계 설정 */
  // User(1) <-> Post(N)
  @OneToMany((type) => Post, (posts) => posts.writer)
  posts!: Post[]

  // User(1) <-> Post_comment(N)
  @OneToMany((type) => Post_comment, (comments) => comments.writer)
  comments!: Post_comment[]

  // User(1) <-> Chat_message(N)
  @OneToMany((type) => Chat_message, (messages) => messages.writer)
  messages!: Chat_message[]

  //! User(1) <-> Post_like(N)
  @OneToMany((type) => Post_like, (post_likes) => post_likes.liker)
  post_likes!: Post_like[]
}
