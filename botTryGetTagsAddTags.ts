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

let contentOfJson: string = fs.readFileSync(__dirname + '/mysqlPara.json', 'utf-8');
let obj: MyObj = JSON.parse(contentOfJson);


const token: string = "puppet_padlocal_85f584183cb345459e3de985e01b0fe5"            // padlocal token
const puppet = new PuppetPadlocal({ token })

// don't know why, if we define here, the function will not get the records while
// inside other functions, looks like this cannot be a static variable.. 
const globaltagCatalogs =  getAllTagRecords();
console.log("firstly tags from db is ", globaltagCatalogs);

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

    dealwithAutoReply(message);
})

.start()

console.log("TestBot", "started");

/**
 * Main Contact Bot
 */
async function main() {
    //const contactList = await bot.Contact.findAll()
    const contactList = await bot.Contact.findAll({ name: 'Medusa' })

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
    /*
    const SLEEP = 7
    log.info('Bot', 'I will re-dump contact weixin id & names after %d second... ', SLEEP)
    setTimeout(main, SLEEP * 1000)
    */
  }


  async function getAllTagRecords() : Promise<TagCatalog[]>{
    
     return createMySQLConnection().then(async connection => {
      
        let allTagsCatalogs = await connection.manager.find(TagCatalog);
        console.log("All catalogs from the db: ", allTagsCatalogs);

        // close the connection.
        connection.close();
        return allTagsCatalogs;
      }).catch(error => {
        console.log(error);
        return [];
      });
  }

  async function dealwithAutoReply(message: Message){
    /*
    if(tagCatalogs ===null){
      return;
    }
    */


    let fromPerson =  await message.talker();
      console.log("the person who sent the message is ", fromPerson);
      if(fromPerson === null){
        return;
      }

       // display more info of this contact!
      let aliasRes:string = await fromPerson.alias() as string;
      if(aliasRes !=null){
      log.info("after judge current contact alias is: %s  ", aliasRes);
      console.log("after judge current contact alias is: ", aliasRes);
      }

      log.info("current contact alias: %s  ", await fromPerson.alias());
      log.info("current contact id property is: %s  ", fromPerson['id']);
      log.info("current contact payload property is: %s  ", fromPerson['payload']);


      const payload = fromPerson['payload'];
      log.info("current contact alias inside payload is: %s  ", payload?.alias);
      log.info("current contact name inside payload is: %s  ", payload?.name);



      const isFriend = await fromPerson.friend();

      if(!isFriend){
        console.log("the person is not my friend ", fromPerson);
        return;
      }

      console.log("the person is my good friend ", fromPerson);

      const tagsOfCurPerson = await fromPerson.tags();
      console.log("all the tags of the current persion is ", tagsOfCurPerson);

      //let tagCatalogs = getAllTagRecords();
      console.log("all the tags in our db is ", globaltagCatalogs);

      (await globaltagCatalogs).forEach(tagRecord => {
        let autoReplyMsg: string = tagRecord.autoReplyMsg;
          
        for(let j=0; j< tagsOfCurPerson.length; j++){
          let curTagNameOfSender: string = tagsOfCurPerson[j]['id'];
          console.log("the current tag for current person is ", curTagNameOfSender);

          console.log("the current tag in our db is ", tagRecord.tag)
          if(tagRecord.tag === curTagNameOfSender){
            // deal with matched person
            replyMessageAndProcessMatchedPerson(fromPerson, autoReplyMsg, message, curTagNameOfSender);
            
          }
          else{
            log.info(
              "the two tags of %s and %s are different, will do nothing",
              tagRecord.tag,
              curTagNameOfSender);
          }
        }
      });
}

async function replyMessageAndProcessMatchedPerson(fromPerson: Contact, autoReplyMsg: string, message: Message, tagName: string){
  if(tagName === "btc"){
    replyBtcMessage(fromPerson, autoReplyMsg, message, tagName);
    updateDbForInterest(fromPerson, tagName);
  }
  else if(tagName === "company"){
    replyCompanayMessage(fromPerson, autoReplyMsg, message, tagName);
    updateDbForInterest(fromPerson, tagName);
  }

  else{
    log.info(
      "will send message of %s for the person of %s", 
      autoReplyMsg,
      fromPerson
    );

    // will really send the message to the sender!
    fromPerson.say(autoReplyMsg);

    
  }
}

async function replyBtcMessage(fromPerson: Contact, autoReplyMsg: string, message: Message, tagName: string){
  let text = message.text();
    
  // if they are not going to get the detail message.
    if(text != "1" ){
      fromPerson.say(autoReplyMsg);
      return;
    }

    else{
      sayCurrentPrice(fromPerson);
    }
}

async function replyCompanayMessage(fromPerson: Contact, autoReplyMsg: string, message: Message, tagName: string){
  let text = message.text();

  if(text != "1" ){
    fromPerson.say(autoReplyMsg);
    return;
  }

  else{
    sayCurrentUnicorns(fromPerson);
  }
}


async function updateDbForInterest(fromPerson: Contact, tagName: string){
  createMySQLConnection().then(async connection => {
  
    let personRepository = connection.getRepository(ContactAndInterest);

    let personIntrestToUpdate = await personRepository.findOne({wxid: fromPerson.id});

    console.log("the person to update from the db: ", personIntrestToUpdate);

    if(personIntrestToUpdate){
      personIntrestToUpdate.wxid  = fromPerson.id;

      // if before is true then assign, else use empty
      personIntrestToUpdate.alias = await fromPerson.alias() || '';
      personIntrestToUpdate.name = await fromPerson.name() || '';
      personIntrestToUpdate.tag  = tagName;
      personIntrestToUpdate.talktimes = personIntrestToUpdate.talktimes + 1;
    }else{
      personIntrestToUpdate = new ContactAndInterest();

      personIntrestToUpdate.wxid  = fromPerson.id;
      personIntrestToUpdate.alias = await fromPerson.alias() || '';
      personIntrestToUpdate.name = await fromPerson.name() || '';
      personIntrestToUpdate.tag  = tagName;
      personIntrestToUpdate.talktimes =  1;
    }

    console.log("personIntrestToUpdate wxid is ", personIntrestToUpdate.wxid );
    console.log("personIntrestToUpdate alias is ", personIntrestToUpdate.alias );
    console.log("personIntrestToUpdate name is ", personIntrestToUpdate.name );
    console.log("personIntrestToUpdate tag is ", personIntrestToUpdate.tag );
    console.log("personIntrestToUpdate talktimes is ", personIntrestToUpdate.talktimes );


    await personRepository.save(personIntrestToUpdate);
    log.info("updated the personInterest object of %s", personIntrestToUpdate);

    // close the connection.
    connection.close();
  }).catch(error => {
    console.log(error);
  });
}

async function sayCurrentPrice(fromPersion: Contact){
  createMySQLConnection().then(async connection => {
  
    let btcMessageRepository = connection.getRepository(BtcPriceMessage);

    let btcCurrentPrice = await btcMessageRepository.findOne({id: 1});

    console.log("the current price meesage: ", btcCurrentPrice);

    if(btcCurrentPrice){
      fromPersion.say(btcCurrentPrice.message);
    }else{
      fromPersion.say("Sorry, did not find the current btc price in our system");
    }

    // close the connection.
    connection.close();
  })
}

async function sayCurrentUnicorns(fromPersion: Contact){
  createMySQLConnection().then(async connection => {
  
    let unicornRepository = connection.getRepository(UniCorn);

    let highestUnicorns = await unicornRepository.findOne({id: 1});

    console.log("the current unicorn meesage: ", highestUnicorns);

    if(highestUnicorns){
      fromPersion.say(highestUnicorns.message);
    }else{
      fromPersion.say("Sorry, did not find the current unicorn information in our system");
    }

    // close the connection.
    connection.close();
  })
}

async function createMySQLConnection(): Promise<Connection>{
  return createConnection({
    type: "mysql",
    host: obj.host,
    port: 3306,
    username: obj.username,
    password: obj.password,
    database: obj.database,
    ssl: {
        ca: fs.readFileSync( __dirname + '/BaltimoreCyberTrustRoot.crt.pem' )
    },
    entities: [
        __dirname + "/entity/*.ts"
    ],
    synchronize: true,
    logging: false
  })
}
