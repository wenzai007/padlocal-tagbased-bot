"use strict";
// botTryGetTagsAddTags.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const wechaty_puppet_padlocal_1 = require("wechaty-puppet-padlocal");
const wechaty_1 = require("wechaty");
// padlocal token
const token = "puppet_padlocal_85f584183cb345459e3de985e01b0fe5";
const puppet = new wechaty_puppet_padlocal_1.PuppetPadlocal({ token });
// don't know why, if we define here, the function will not get the records while
// inside other functions, looks like this cannot be a static variable.. 
const bot = new wechaty_1.Wechaty({
    name: "TestBot",
    puppet,
});
bot
    .on("scan", (qrcode, status) => {
    if (status === wechaty_1.ScanStatus.Waiting && qrcode) {
        const qrcodeImageUrl = ["https://api.qrserver.com/v1/create-qr-code/?data=", encodeURIComponent(qrcode)].join("");
        console.log(`onScan: ${wechaty_1.ScanStatus[status]}(${status}) - ${qrcodeImageUrl}`);
    }
    else {
        console.log(`onScan: ${wechaty_1.ScanStatus[status]}(${status})`);
    }
})
    .on("login", (user) => {
    console.log(`${user} login`);
    // here we run the main method
    main();
})
    .on("logout", (user) => {
    console.log(`${user} logout`);
})
    .on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`on message: the message is from ${message.from()}`);
    console.log(`on message: the message content: ${message.text()}`);
    //dealwithAutoReply(message);
}))
    .start();
console.log("TestBot", "started");
/**
 * Main Contact Bot
 */
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        //const contactList = await bot.Contact.findAll()
        const contactList = yield bot.Contact.findAll({ name: 'Owen' });
        wechaty_1.log.info('Bot', '#######################');
        wechaty_1.log.info('Bot', 'Contact number: %d\n', contactList.length);
        /**
         * official contacts list
         */
        for (let i = 0; i < contactList.length; i++) {
            const contact = contactList[i];
            if (contact.type() === wechaty_1.Contact.Type.Official) {
                wechaty_1.log.info('Bot', `official ${i}: ${contact}`);
            }
        }
        /**
         *  personal contact list
         */
        for (let i = 0; i < contactList.length; i++) {
            const contact = contactList[i];
            if (contact.type() === wechaty_1.Contact.Type.Individual) {
                wechaty_1.log.info('Bot', `personal ${i}: ${contact.name()} : ${contact.id}`);
            }
        }
        const MAX = 17;
        for (let i = 0; i < contactList.length; i++) {
            const contact = contactList[i];
            const tagNames = yield contact.tags();
            for (var property in tagNames) {
                wechaty_1.log.info(property + "=" + tagNames[property]);
            }
            if (tagNames != null && tagNames.length > 0) {
                for (let m = 0; m < tagNames.length; m++) {
                    wechaty_1.log.info('Bot', 'Contact: "%s" with tag name for each of them is: "%s"', contact.name(), tagNames[m]['id']);
                    /*
                    var pp = tagNames[m];
                    for(var property in pp) {
                      log.info(property);
                      log.info(pp['id'])
                    }
                    */
                }
            }
            const tag = yield bot.Tag.get('newtesttag');
            //const tag = await bot.Tag.get('pretty');
            wechaty_1.log.info('Bot', 'current loaded tag is "%s"', tag['id']);
            const isFriend = contact.friend();
            wechaty_1.log.info('Bot', 'Contact: "%s" is our friend?  result is : "%s"', contact.name(), isFriend);
            if (isFriend != true) {
                wechaty_1.log.info('Bot', 'Contact: "%s" is not the friend of the bot, so will not add into the tag : "%s"', contact.name(), tag['id']);
            }
            else {
                wechaty_1.log.info('Bot', 'Contact: "%s" is bot friend and will try to add into the tag of : "%s"', contact.name(), tag['id']);
                const tagsOfCurrentContact = yield contact.tags();
                if (tagsOfCurrentContact.indexOf(tag) >= 0) {
                    wechaty_1.log.info('Bot', 'Contact: "%s" is bot friend and previously already added into the tag of : "%s"'
                        + ', so this time we just skip adding it', contact.name(), tag['id']);
                }
                else {
                    yield tag.add(contact);
                    wechaty_1.log.info('Bot', 'Contact: "%s" is bot friend and already added into the tag of : "%s"', contact.name(), tag['id']);
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
                wechaty_1.log.info('Bot', 'Contacts too many, I only show you the first %d ... ', MAX);
                break;
            }
        }
        // don't re-dump weixin now just comment out this part...
        const SLEEP = 7;
        wechaty_1.log.info('Bot', 'I will re-dump contact weixin id & names after %d second... ', SLEEP);
        setTimeout(main, SLEEP * 1000);
    });
}
//# sourceMappingURL=botTryGetTagsAddTags.js.map