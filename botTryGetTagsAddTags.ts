// botTryGetTagsAddTags.ts

import "reflect-metadata";
import {createConnection, Connection} from "typeorm";
import {TagCatalog} from "./entity/TagCatalog";
import {ContactAndInterest} from "./entity/ContactAndInterest";

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
// log.level("silly");


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

/*
.on("ready", async () => {


  let contactList = await bot.Contact.findAll()
  console.debug(contactList)

 
})

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
.on("error", (error) => {
  log.error(LOGPRE, `on error: ${error}`);
})

// here to start.
bot.start().then(() => {
log.info(LOGPRE, "started.");
});


/**
 * Main Contact Bot
 */
async function main() {
    //const contactList = await bot.Contact.findAll()
    log.info('Bot', 'starting the main function')

    await puppet.syncContact()
//    const contactList = await bot.Contact.findAll({ name: 'Marty' })
    const contactList = await bot.Contact.findAll()
//    const contactList = await bot.Contact.findAll({id: 'jynbman'})

    // const contactList = await bot.Contact.findAll({type: PUPPET.types.Contact.Official})

    log.info('Bot', '#######################')
    log.info('Bot', 'Contact number: %d\n', contactList.length)
  
    /**
     * official contacts list
     */
    for (let i = 0; i < contactList.length; i++) {
      const contact = contactList[i]
      if (contact.type() === PUPPET.types.Contact.Official) {
        log.info('Bot', `official ${i}: ${contact}`)
      }
    }
  
    /**
     *  personal contact list
     */
  
    for (let i = 0; i < contactList.length; i++) {
      const contact = contactList[i]
      if (contact.type() === PUPPET.types.Contact.Individual) {
        log.info('Bot', `personal ${i}: ${contact.name()} : ${contact.id}`)
      }
    }
  
    const MAX = 17
    for (let i = 0; i < contactList.length; i++ ) {
      const contact = contactList[i]
    
      const tagNames = await contact.tags();

      for(var property in tagNames) {
        log.info(property + "=" + tagNames[property]);
      }

      if(tagNames!=null && tagNames.length >0){
          for(let m=0;m<tagNames.length;m++){
            log.info('Bot', 'Contact: "%s" with tag name for each of them is: "%s"',
                      contact.name(),
                      tagNames[m]['id'],
              )

              /*
              var pp = tagNames[m];
              for(var property in pp) {
                log.info(property);
                log.info(pp['id'])
              }
              */
          }
      }

      const tag = await bot.Tag.get('newtesttag');
      //const tag = await bot.Tag.get('pretty');

      log.info('Bot', 'current loaded tag is "%s"', 
                tag['id']);

      const isFriend = contact.friend();

      log.info('Bot', 'Contact: "%s" is our friend?  result is : "%s"',
      contact.name(),
      isFriend,
      );

     
      if(isFriend != true ){
        log.info('Bot', 'Contact: "%s" is not the friend of the bot, so will not add into the tag : "%s"',
        contact.name(),
        tag['id'],
        );
      }
      else{
        log.info('Bot', 'Contact: "%s" is bot friend and will try to add into the tag of : "%s"',
        contact.name(),
        tag['id'],
        );

        const tagsOfCurrentContact = await contact.tags()
        if(tagsOfCurrentContact.indexOf(tag)>=0){
            log.info('Bot', 'Contact: "%s" is bot friend and previously already added into the tag of : "%s"'
            +', so this time we just skip adding it' ,
            contact.name(),
            tag['id'],
            );
        }
        else{
          await tag.add(contact);

          log.info('Bot', 'Contact: "%s" is bot friend and already added into the tag of : "%s"',
          contact.name(),
          tag['id'],
          );
        }
      }
     

      /**
       * Save avatar to file like: "1-name.jpg"
       */
      /*
      const file = await contact.avatar()
      const name = file.name
      await file.toFile(name, true)

      log.info('Bot', 'Contact: "%s" with avatar file: "%s"',
                      contact.name(),
                      name,
              )

      */
  
      if (i > MAX) {
        log.info('Bot', 'Contacts too many, I only show you the first %d ... ', MAX)
        break
      }
    }
  
    // don't re-dump weixin now just comment out this part...
    const SLEEP = 7
    log.info('Bot', 'I will re-dump contact weixin id & names after %d second... ', SLEEP)
    setTimeout(main, SLEEP * 1000)
  }

