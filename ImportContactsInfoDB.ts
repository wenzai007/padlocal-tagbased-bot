// botTryGetTagsAddTags.ts

import "reflect-metadata";
import {createConnection, Connection} from "typeorm";
import {TagCatalog} from "./entity/TagCatalog";
import {ContactAndInterest} from "./entity/ContactAndInterest";
import {WechatFriendUserInfoInMartyAccount} from "./entity/WechatFriendUserInfoInMartyAccount";

import * as fs from 'fs';

import {PuppetPadlocal} from "wechaty-puppet-padlocal";
import {Contact, Message, ScanStatus, Wechaty, log, Tag} from "wechaty";
import { BtcPriceMessage } from "./entity/BtcPriceMessage";
import { UniCorn } from "./entity/UniCorn";

interface MyObj {
  host: string;
  username: string;
  password: string;
  database: string;
}

// open the debug logging.
// log.level("silly");

let mainExecuteCount = 0

let contentOfJson: string = fs.readFileSync('d:/Working/MyOwnGithub/padlocal-tagbased-bot/ormconfig.json', 'utf-8');

let obj: MyObj = JSON.parse(contentOfJson);

// padlocal token
const token: string = "puppet_padlocal_85f584183cb345459e3de985e01b0fe5"
const puppet = new PuppetPadlocal({ token })

// don't know why, if we define here, the function will not get the records while
// inside other functions, looks like this cannot be a static variable.. 
const bot = new Wechaty({
    name: "TestBot",
    puppet,
})



bot
.on("scan", (qrcode: string, status: ScanStatus) => {
    if (status === ScanStatus.Waiting && qrcode) {
        const qrcodeImageUrl = ["https://api.qrserver.com/v1/create-qr-code/?data=", encodeURIComponent(qrcode)].join("");
        console.log(`onScan: ${ScanStatus[status]}(${status}) - ${qrcodeImageUrl}`);
    } else { 
        console.log(`onScan: ${ScanStatus[status]}(${status})`);
    }
})

.on("login", (user: Contact) => {
    console.log(`${user} login`);

    // here we run the main method, this is sync method to call async, so it will not block and wait.
    mainExecuteCount = mainExecuteCount + 1
    if(mainExecuteCount >= 2)
    {
        return
    }

    main()
})

.on("logout", (user: Contact) => {
    console.log(`${user} logout`);
})

.on("message", async (message: Message) => {
    console.log(`on message: the message is from ${message.from()}`);
    console.log(`on message: the message content: ${message.text()}`);

    //dealwithAutoReply(message);
})

.start()


console.log("TestBot", "started");



/**
 * Main Contact Bot
 */
async function main() {
    //const contactList = await bot.Contact.findAll()
    log.info('Bot', 'starting the main function')

    const contactList = await bot.Contact.findAll()

    //const contactList = await bot.Contact.findAll({ name: 'Owen' })


    log.info('Bot', '#######################')
    log.info('Bot', 'Contact number: %d\n', contactList.length)
    
    let wechatUsers: WechatFriendUserInfoInMartyAccount[] = []


    /**
     * official contacts list
     */
    for (let i = 0; i < contactList.length; i++) {
        const contact = contactList[i]
        let isFriend = await contact.friend()

        /*
        let description = await contact.description()
        let isStar = await contact.star()
        let isCoworker = await contact.coworker();
        let title= await contact.title()
        */

        if (contact.type() === Contact.Type.Official) {
            log.info('Bot', `official ${i}: ${contact}`)
        }

        /**
        *  personal contact list
        */
        else if(contact.type() === Contact.Type.Individual && isFriend) {
            let wechatUser = new WechatFriendUserInfoInMartyAccount()

            let tagNamesForCurUser: string = ""
            log.info('Bot', `personal ${i}: ${contact.name()} : ${contact.id}`)
            const tagNames = await contact.tags();

            for(var property in tagNames) {
                log.info(property + "=" + tagNames[property]);
            }

            if(tagNames!=null && tagNames.length >0){
                for(let m=0; m<tagNames.length; m++){
                    log.info('Bot', 'Contact: "%s" with tag name for each of them is: "%s"',
                            contact.name(),
                            tagNames[m]['id'],
                            )
                    
                }

                tagNamesForCurUser = tagNames.join(';')
            }

            wechatUser.tag = tagNamesForCurUser

            const payload = contact['payload'];

            wechatUser.wxid = payload?.id as string
            wechatUser.gender = payload?.gender as number
            wechatUser.name = payload?.name as string
            wechatUser.avatar = payload?.avatar as string 
            wechatUser.alias = payload?.alias as string
            wechatUser.weixinName = payload?.weixin as string
            wechatUser.city = payload?.city as string
            wechatUser.isFriend = payload?.friend as boolean
            wechatUser.province = payload?.province as string
            wechatUser.signature = payload?.signature as string
            wechatUser.phone = payload?.phone.join(';') as string

            // only add when it is individual personal contact
            wechatUsers.push(wechatUser)
        }
    }

    await createMySQLConnection().then(async connection => {
        let wechatUserRepository = connection.getRepository(WechatFriendUserInfoInMartyAccount)
        

        wechatUsers.forEach(async function(value){

            await wechatUserRepository.save(value);
            console.info("insert successfully")
        });

        /*
        let friendOfMine: any
        for(friendOfMine in wechatUsers){
            await wechatUserRepository.save(friendOfMine)
            // await connection.manager.save(friendOfMine)
            console.info("insert successfully")
        }
        */

        console.info("insert all successfully")

        
        /*
        wechatUsers.forEach(async function(value){

            await wechatUserRepository.save(value);

        });
        */

    }).catch(error => console.log(error));

}
  
   
async function createMySQLConnection(): Promise<Connection>{
    let entitiesPath : string


    if(__dirname.includes("out")){
        entitiesPath = "d:/Working/MyOwnGithub/padlocal-tagbased-bot/out/entity/*.js"
    }else{
        entitiesPath = "d:/Working/MyOwnGithub/padlocal-tagbased-bot/entity/*.ts"
    }

    return createConnection({
      type: "mysql",
      host: obj.host,
      port: 3306,
      username: obj.username,
      password: obj.password,
      database: obj.database,
      /*
      ssl: {
          ca: fs.readFileSync( __dirname + '/BaltimoreCyberTrustRoot.crt.pem' )
      },
      */
      entities: [
        entitiesPath
      ],
      synchronize: true,
      logging: false
    })
}

