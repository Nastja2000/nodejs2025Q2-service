import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export interface IUser {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export interface IUserResponse {
  id: string;
  login: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column({type: 'int', default: 1})
  version: number;

  @Column({type: 'bigint'})
  createdAt: number;

  @Column({type: 'bigint'})
  updatedAt: number;
}
