// botTryGetTagsAddTags.ts

import {PuppetPadlocal} from "wechaty-puppet-padlocal";
import {Contact, Message, ScanStatus, Wechaty, log} from "wechaty";

const token: string = "puppet_padlocal_85f584183cb345459e3de985e01b0fe5"            // padlocal token
const puppet = new PuppetPadlocal({ token })


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
    main()
})

.on("logout", (user: Contact) => {
    console.log(`${user} logout`);
})

.on("message", async (message: Message) => {
    console.log(`on message: ${message.toString()}`);
})

.start()

console.log("TestBot", "started");



/**
 * Main Contact Bot
 */
async function main() {
    const contactList = await bot.Contact.findAll()
  
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
                      tagNames[m],
              )

              var pp = tagNames[m];
              for(var property in pp) {
                log.info(property);
                log.info(pp['id'])
              }
          }
      }

      /**
       * Save avatar to file like: "1-name.jpg"
       */
      const file = await contact.avatar()
      const name = file.name
      await file.toFile(name, true)
  
      log.info('Bot', 'Contact: "%s" with avatar file: "%s"',
                      contact.name(),
                      name,
              )
  
      if (i > MAX) {
        log.info('Bot', 'Contacts too many, I only show you the first %d ... ', MAX)
        break
      }
    }
  
    const SLEEP = 7
    log.info('Bot', 'I will re-dump contact weixin id & names after %d second... ', SLEEP)
    setTimeout(main, SLEEP * 1000)
  
  }