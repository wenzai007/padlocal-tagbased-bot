// botTryGetTagsAddTags.ts

import "reflect-metadata";
import {createConnection, Connection} from "typeorm";
import {TagCatalog} from "./entity/TagCatalog";
import {ContactAndInterest} from "./entity/ContactAndInterest";

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

    // here we run the main method
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
    const contactList = await bot.Contact.findAll({ name: 'Owen' })

    log.info('Bot', '#######################')
    log.info('Bot', 'Contact number: %d\n', contactList.length)
  
    /**
     * official contacts list
     */
    for (let i = 0; i < contactList.length; i++) {
      const contact = contactList[i]
      if (contact.type() === Contact.Type.Official) {
        log.info('Bot', `official ${i}: ${contact}`)
      }
    }
  
    /**
     *  personal contact list
     */
  
    for (let i = 0; i < contactList.length; i++) {
      const contact = contactList[i]
      if (contact.type() === Contact.Type.Individual) {
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

