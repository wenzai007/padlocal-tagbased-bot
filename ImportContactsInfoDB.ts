// botTryGetTagsAddTags.ts

import "reflect-metadata";
import {createConnection, Connection} from "typeorm";
import {TagCatalog} from "./entity/TagCatalog";
import {ContactAndInterest} from "./entity/ContactAndInterest";
import {WechatFriendUserInfoInMartyAccount} from "./entity/WechatFriendUserInfoInMartyAccount";

import * as fs from 'fs';

import {PuppetPadlocal} from "wechaty-puppet-padlocal";
import {dingDongBot, getMessagePayload, LOGPRE} from "./helper";
import {Contact, Message, ScanStatus, Wechaty, log, Tag, WechatyBuilder} from "wechaty";
import * as PUPPET from 'wechaty-puppet'
import { BtcPriceMessage } from "./entity/BtcPriceMessage";
import { UniCorn } from "./entity/UniCorn";

interface MyObj {
  host: string;
  username: string;
  password: string;
  database: string;
}

// open the debug logging.
log.level("silly");

let mainExecuteCount = 0

let contentOfJson: string = fs.readFileSync('E:/Working/MyOwnGithub/padlocal-tagbased-bot/ormconfig.json', 'utf-8');

let obj: MyObj = JSON.parse(contentOfJson);

// padlocal token
// const token: string = "puppet_padlocal_85f584183cb345459e3de985e01b0fe5"
const token: string = "puppet_padlocal_30a4a75df12f470e8af1642cd5e7e7e1"

const puppet = new PuppetPadlocal({ token })

// don't know why, if we define here, the function will not get the records while
// inside other functions, looks like this cannot be a static variable.. 
const bot = WechatyBuilder.build({
  name: "PadLocalDemo",
  puppet,
})


bot
.on("scan", (qrcode: string, status: ScanStatus) => {
    if (status === ScanStatus.Waiting && qrcode) {
      const qrcodeImageUrl = [
        'https://wechaty.js.org/qrcode/',
        encodeURIComponent(qrcode),
      ].join('')

      log.info(LOGPRE, `onScan: ${ScanStatus[status]}(${status}) - ${qrcodeImageUrl}`);

      require('qrcode-terminal').generate(qrcode, {small: true})  // show qrcode on console
    } else {
      log.info(LOGPRE, `onScan: ${ScanStatus[status]}(${status})`);
    }
})

.on("login", (user: Contact) => {
  log.info(LOGPRE, `${user} login`);

    // here we run the main method, this is sync method to call async, so it will not block and wait.
    main()
})

.on("logout", (user, reason) => {
  log.info(LOGPRE, `${user} logout, reason: ${reason}`);
})
.on("error", (error) => {
    log.error(LOGPRE, `on error: ${error}`);
  })
/*
.on("message", async (message) => {
  log.info(LOGPRE, `on message: ${message.toString()}`);

  await getMessagePayload(message);

  await dingDongBot(message);
})

.on("room-invite", async (roomInvitation) => {
  log.info(LOGPRE, `on room-invite: ${roomInvitation}`);
})

.on("room-join", (room, inviteeList, inviter, date) => {
  log.info(LOGPRE, `on room-join, room:${room}, inviteeList:${inviteeList}, inviter:${inviter}, date:${date}`);
})

.on("room-leave", (room, leaverList, remover, date) => {
  log.info(LOGPRE, `on room-leave, room:${room}, leaverList:${leaverList}, remover:${remover}, date:${date}`);
})

.on("room-topic", (room, newTopic, oldTopic, changer, date) => {
  log.info(LOGPRE, `on room-topic, room:${room}, newTopic:${newTopic}, oldTopic:${oldTopic}, changer:${changer}, date:${date}`);
})

.on("friendship", (friendship) => {
  log.info(LOGPRE, `on friendship: ${friendship}`);
})

*/



// here to start.
bot.start().then(() => {
log.info(LOGPRE, "started.");
});



/**
 * Main Contact Bot
 */
async function main() {
    log.info('Bot', 'starting the main function')

    await puppet.syncContact()

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

        if (contact.type() === PUPPET.types.Contact.Official) {
            log.info('Bot', `official ${i}: ${contact}`)
        }

        /**
        *  personal contact list
        */
        else if(contact.type() === PUPPET.types.Contact.Individual && isFriend) {
            let wechatUser = new WechatFriendUserInfoInMartyAccount()

            let tagNamesForCurUser: string = ""
            log.info('Bot', `personal ${i}: ${contact.name()} : ${contact.id}`)
            const tagNames = await contact.tags();

            let tagArray: string[] = []
            for(var property in tagNames) {
                log.info(property + "=" + tagNames[property]);
            }

            if(tagNames!=null && tagNames.length >0){
                for(let m=0; m<tagNames.length; m++){
                    log.info(
                        'Bot', 'Contact: "%s" with tag name for each of them is: "%s"',
                        contact.name(),
                        tagNames[m]['id'])
                    
                    tagArray.push(tagNames[m]['id'])
                }

                tagNamesForCurUser = tagArray.join(';')
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
        entitiesPath = "E:/Working/MyOwnGithub/padlocal-tagbased-bot/out/entity/*.js"
    }else{
        entitiesPath = "E:/Working/MyOwnGithub/padlocal-tagbased-bot/entity/*.ts"
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

