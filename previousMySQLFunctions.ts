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


const globaltagCatalogs =  getAllTagRecords();
console.log("firstly tags from db is ", globaltagCatalogs);


let contentOfJson: string = fs.readFileSync(__dirname + '/mysqlPara.json', 'utf-8');

let obj: MyObj = JSON.parse(contentOfJson);



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
   if(globaltagCatalogs ===null){
     return;
   }

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