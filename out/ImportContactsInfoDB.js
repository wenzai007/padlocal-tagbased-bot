"use strict";
// botTryGetTagsAddTags.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const typeorm_1 = require("typeorm");
const WechatFriendUserInfoInMartyAccount_1 = require("./entity/WechatFriendUserInfoInMartyAccount");
const fs = __importStar(require("fs"));
const wechaty_puppet_padlocal_1 = require("wechaty-puppet-padlocal");
const wechaty_1 = require("wechaty");
// open the debug logging.
// log.level("silly");
let mainExecuteCount = 0;
let contentOfJson = fs.readFileSync('d:/Working/MyOwnGithub/padlocal-tagbased-bot/ormconfig.json', 'utf-8');
let obj = JSON.parse(contentOfJson);
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
    // here we run the main method, this is sync method to call async, so it will not block and wait.
    mainExecuteCount = mainExecuteCount + 1;
    if (mainExecuteCount >= 2) {
        return;
    }
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
        wechaty_1.log.info('Bot', 'starting the main function');
        const contactList = yield bot.Contact.findAll();
        //const contactList = await bot.Contact.findAll({ name: 'Owen' })
        wechaty_1.log.info('Bot', '#######################');
        wechaty_1.log.info('Bot', 'Contact number: %d\n', contactList.length);
        let wechatUsers = [];
        /**
         * official contacts list
         */
        for (let i = 0; i < contactList.length; i++) {
            const contact = contactList[i];
            let isFriend = yield contact.friend();
            /*
            let description = await contact.description()
            let isStar = await contact.star()
            let isCoworker = await contact.coworker();
            let title= await contact.title()
            */
            if (contact.type() === wechaty_1.Contact.Type.Official) {
                wechaty_1.log.info('Bot', `official ${i}: ${contact}`);
            }
            /**
            *  personal contact list
            */
            else if (contact.type() === wechaty_1.Contact.Type.Individual && isFriend) {
                let wechatUser = new WechatFriendUserInfoInMartyAccount_1.WechatFriendUserInfoInMartyAccount();
                let tagNamesForCurUser = "";
                wechaty_1.log.info('Bot', `personal ${i}: ${contact.name()} : ${contact.id}`);
                const tagNames = yield contact.tags();
                for (var property in tagNames) {
                    wechaty_1.log.info(property + "=" + tagNames[property]);
                }
                if (tagNames != null && tagNames.length > 0) {
                    for (let m = 0; m < tagNames.length; m++) {
                        wechaty_1.log.info('Bot', 'Contact: "%s" with tag name for each of them is: "%s"', contact.name(), tagNames[m]['id']);
                    }
                    tagNamesForCurUser = tagNames.join(';');
                }
                wechatUser.tag = tagNamesForCurUser;
                const payload = contact['payload'];
                wechatUser.wxid = payload === null || payload === void 0 ? void 0 : payload.id;
                wechatUser.gender = payload === null || payload === void 0 ? void 0 : payload.gender;
                wechatUser.name = payload === null || payload === void 0 ? void 0 : payload.name;
                wechatUser.avatar = payload === null || payload === void 0 ? void 0 : payload.avatar;
                wechatUser.alias = payload === null || payload === void 0 ? void 0 : payload.alias;
                wechatUser.weixinName = payload === null || payload === void 0 ? void 0 : payload.weixin;
                wechatUser.city = payload === null || payload === void 0 ? void 0 : payload.city;
                wechatUser.isFriend = payload === null || payload === void 0 ? void 0 : payload.friend;
                wechatUser.province = payload === null || payload === void 0 ? void 0 : payload.province;
                wechatUser.signature = payload === null || payload === void 0 ? void 0 : payload.signature;
                wechatUser.phone = payload === null || payload === void 0 ? void 0 : payload.phone.join(';');
                // only add when it is individual personal contact
                wechatUsers.push(wechatUser);
            }
        }
        yield createMySQLConnection().then((connection) => __awaiter(this, void 0, void 0, function* () {
            let wechatUserRepository = connection.getRepository(WechatFriendUserInfoInMartyAccount_1.WechatFriendUserInfoInMartyAccount);
            wechatUsers.forEach(function (value) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield wechatUserRepository.save(value);
                    console.info("insert successfully");
                });
            });
            /*
            let friendOfMine: any
            for(friendOfMine in wechatUsers){
                await wechatUserRepository.save(friendOfMine)
                // await connection.manager.save(friendOfMine)
                console.info("insert successfully")
            }
            */
            console.info("insert all successfully");
            /*
            wechatUsers.forEach(async function(value){
    
                await wechatUserRepository.save(value);
    
            });
            */
        })).catch(error => console.log(error));
    });
}
function createMySQLConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        let entitiesPath;
        if (__dirname.includes("out")) {
            entitiesPath = "d:/Working/MyOwnGithub/padlocal-tagbased-bot/out/entity/*.js";
        }
        else {
            entitiesPath = "d:/Working/MyOwnGithub/padlocal-tagbased-bot/entity/*.ts";
        }
        return (0, typeorm_1.createConnection)({
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
        });
    });
}
//# sourceMappingURL=ImportContactsInfoDB.js.map