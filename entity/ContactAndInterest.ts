import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class ContactAndInterest {
    @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tag: string;
 
  @Column("int")
  talktimes: number;
 
  @Column()
  wxid : string;

  @Column()
  alias : string;

//  @Column({ type: "varchar", charset: "utf8", collation: "utf8_general_ci"})
@Column({ type: "varchar", charset: "utf8", collation: "utf8_bin"})
  name : string;
}