import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class BtcPriceMessage{
    @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;
}