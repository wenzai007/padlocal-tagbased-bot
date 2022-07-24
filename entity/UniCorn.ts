import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class UniCorn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;
}