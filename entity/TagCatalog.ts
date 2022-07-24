import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class TagCatalog {
    @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tag: string;
 
  @Column("text")
  autoReplyMsg: string;
 
  @Column("text")
  scheduleMsg: string;
}