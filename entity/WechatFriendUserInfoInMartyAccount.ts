import {Entity, Column, PrimaryGeneratedColumn, PrimaryColumn} from "typeorm";

@Entity()
export class WechatFriendUserInfoInMartyAccount{
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryColumn()
    @Column()
    wxid : string;

    @Column({ type: "varchar", charset: "utf8", collation: "utf8_bin"})
    tag: string;

    //  @Column({ type: "varchar", charset: "utf8", collation: "utf8_general_ci"})
    @Column({ type: "varchar", charset: "utf8", collation: "utf8_bin"})
    name: string;

    @Column({ type: "varchar", charset: "utf8", collation: "utf8_bin"})
    weixinName: string;

    @Column({ type: "varchar", charset: "utf8", collation: "utf8_bin"})
    city: string;

    @Column({ type: "varchar", charset: "utf8", collation: "utf8_bin"})
    province: string;

    @Column({ type: "varchar", charset: "utf8", collation: "utf8_bin"})
    signature: string;

    @Column({ type: "varchar"})
    phone: string;

    @Column({ type: "varchar"})
    avatar: string;

    @Column("boolean")
    isFriend: boolean;

    @Column("int")
    talktimes: number;

    @Column("int")
    gender: number;
    
    @Column("int")
    type: number;

    @Column()
    alias : string;
}