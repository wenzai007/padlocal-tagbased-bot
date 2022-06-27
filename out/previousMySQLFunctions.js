"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
const TagCatalog_1 = require("./entity/TagCatalog");
const ContactAndInterest_1 = require("./entity/ContactAndInterest");
const fs = __importStar(require("fs"));
const wechaty_1 = require("wechaty");
const BtcPriceMessage_1 = require("./entity/BtcPriceMessage");
const UniCorn_1 = require("./entity/UniCorn");
const globaltagCatalogs = getAllTagRecords();
console.log("firstly tags from db is ", globaltagCatalogs);
let contentOfJson = fs.readFileSync(__dirname + '/mysqlPara.json', 'utf-8');
let obj = JSON.parse(contentOfJson);
function getAllTagRecords() {
    return __awaiter(this, void 0, void 0, function* () {
        return createMySQLConnection().then((connection) => __awaiter(this, void 0, void 0, function* () {
            let allTagsCatalogs = yield connection.manager.find(TagCatalog_1.TagCatalog);
            console.log("All catalogs from the db: ", allTagsCatalogs);
            // close the connection.
            connection.close();
            return allTagsCatalogs;
        })).catch(error => {
            console.log(error);
            return [];
        });
    });
}
function dealwithAutoReply(message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (globaltagCatalogs === null) {
            return;
        }
        let fromPerson = yield message.talker();
        console.log("the person who sent the message is ", fromPerson);
        if (fromPerson === null) {
            return;
        }
        // display more info of this contact!
        let aliasRes = yield fromPerson.alias();
        if (aliasRes != null) {
            wechaty_1.log.info("after judge current contact alias is: %s  ", aliasRes);
            console.log("after judge current contact alias is: ", aliasRes);
        }
        wechaty_1.log.info("current contact alias: %s  ", yield fromPerson.alias());
        wechaty_1.log.info("current contact id property is: %s  ", fromPerson['id']);
        wechaty_1.log.info("current contact payload property is: %s  ", fromPerson['payload']);
        const payload = fromPerson['payload'];
        wechaty_1.log.info("current contact alias inside payload is: %s  ", payload === null || payload === void 0 ? void 0 : payload.alias);
        wechaty_1.log.info("current contact name inside payload is: %s  ", payload === null || payload === void 0 ? void 0 : payload.name);
        const isFriend = yield fromPerson.friend();
        if (!isFriend) {
            console.log("the person is not my friend ", fromPerson);
            return;
        }
        console.log("the person is my good friend ", fromPerson);
        const tagsOfCurPerson = yield fromPerson.tags();
        console.log("all the tags of the current persion is ", tagsOfCurPerson);
        //let tagCatalogs = getAllTagRecords();
        console.log("all the tags in our db is ", globaltagCatalogs);
        (yield globaltagCatalogs).forEach(tagRecord => {
            let autoReplyMsg = tagRecord.autoReplyMsg;
            for (let j = 0; j < tagsOfCurPerson.length; j++) {
                let curTagNameOfSender = tagsOfCurPerson[j]['id'];
                console.log("the current tag for current person is ", curTagNameOfSender);
                console.log("the current tag in our db is ", tagRecord.tag);
                if (tagRecord.tag === curTagNameOfSender) {
                    // deal with matched person
                    replyMessageAndProcessMatchedPerson(fromPerson, autoReplyMsg, message, curTagNameOfSender);
                }
                else {
                    wechaty_1.log.info("the two tags of %s and %s are different, will do nothing", tagRecord.tag, curTagNameOfSender);
                }
            }
        });
    });
}
function replyMessageAndProcessMatchedPerson(fromPerson, autoReplyMsg, message, tagName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (tagName === "btc") {
            replyBtcMessage(fromPerson, autoReplyMsg, message, tagName);
            updateDbForInterest(fromPerson, tagName);
        }
        else if (tagName === "company") {
            replyCompanayMessage(fromPerson, autoReplyMsg, message, tagName);
            updateDbForInterest(fromPerson, tagName);
        }
        else {
            wechaty_1.log.info("will send message of %s for the person of %s", autoReplyMsg, fromPerson);
            // will really send the message to the sender!
            fromPerson.say(autoReplyMsg);
        }
    });
}
function replyBtcMessage(fromPerson, autoReplyMsg, message, tagName) {
    return __awaiter(this, void 0, void 0, function* () {
        let text = message.text();
        // if they are not going to get the detail message.
        if (text != "1") {
            fromPerson.say(autoReplyMsg);
            return;
        }
        else {
            sayCurrentPrice(fromPerson);
        }
    });
}
function replyCompanayMessage(fromPerson, autoReplyMsg, message, tagName) {
    return __awaiter(this, void 0, void 0, function* () {
        let text = message.text();
        if (text != "1") {
            fromPerson.say(autoReplyMsg);
            return;
        }
        else {
            sayCurrentUnicorns(fromPerson);
        }
    });
}
function updateDbForInterest(fromPerson, tagName) {
    return __awaiter(this, void 0, void 0, function* () {
        createMySQLConnection().then((connection) => __awaiter(this, void 0, void 0, function* () {
            let personRepository = connection.getRepository(ContactAndInterest_1.ContactAndInterest);
            let personIntrestToUpdate = yield personRepository.findOne({ wxid: fromPerson.id });
            console.log("the person to update from the db: ", personIntrestToUpdate);
            if (personIntrestToUpdate) {
                personIntrestToUpdate.wxid = fromPerson.id;
                // if before is true then assign, else use empty
                personIntrestToUpdate.alias = (yield fromPerson.alias()) || '';
                personIntrestToUpdate.name = (yield fromPerson.name()) || '';
                personIntrestToUpdate.tag = tagName;
                personIntrestToUpdate.talktimes = personIntrestToUpdate.talktimes + 1;
            }
            else {
                personIntrestToUpdate = new ContactAndInterest_1.ContactAndInterest();
                personIntrestToUpdate.wxid = fromPerson.id;
                personIntrestToUpdate.alias = (yield fromPerson.alias()) || '';
                personIntrestToUpdate.name = (yield fromPerson.name()) || '';
                personIntrestToUpdate.tag = tagName;
                personIntrestToUpdate.talktimes = 1;
            }
            console.log("personIntrestToUpdate wxid is ", personIntrestToUpdate.wxid);
            console.log("personIntrestToUpdate alias is ", personIntrestToUpdate.alias);
            console.log("personIntrestToUpdate name is ", personIntrestToUpdate.name);
            console.log("personIntrestToUpdate tag is ", personIntrestToUpdate.tag);
            console.log("personIntrestToUpdate talktimes is ", personIntrestToUpdate.talktimes);
            yield personRepository.save(personIntrestToUpdate);
            wechaty_1.log.info("updated the personInterest object of %s", personIntrestToUpdate);
            // close the connection.
            connection.close();
        })).catch(error => {
            console.log(error);
        });
    });
}
function sayCurrentPrice(fromPersion) {
    return __awaiter(this, void 0, void 0, function* () {
        createMySQLConnection().then((connection) => __awaiter(this, void 0, void 0, function* () {
            let btcMessageRepository = connection.getRepository(BtcPriceMessage_1.BtcPriceMessage);
            let btcCurrentPrice = yield btcMessageRepository.findOne({ id: 1 });
            console.log("the current price meesage: ", btcCurrentPrice);
            if (btcCurrentPrice) {
                fromPersion.say(btcCurrentPrice.message);
            }
            else {
                fromPersion.say("Sorry, did not find the current btc price in our system");
            }
            // close the connection.
            connection.close();
        }));
    });
}
function sayCurrentUnicorns(fromPersion) {
    return __awaiter(this, void 0, void 0, function* () {
        createMySQLConnection().then((connection) => __awaiter(this, void 0, void 0, function* () {
            let unicornRepository = connection.getRepository(UniCorn_1.UniCorn);
            let highestUnicorns = yield unicornRepository.findOne({ id: 1 });
            console.log("the current unicorn meesage: ", highestUnicorns);
            if (highestUnicorns) {
                fromPersion.say(highestUnicorns.message);
            }
            else {
                fromPersion.say("Sorry, did not find the current unicorn information in our system");
            }
            // close the connection.
            connection.close();
        }));
    });
}
function createMySQLConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        return typeorm_1.createConnection({
            type: "mysql",
            host: obj.host,
            port: 3306,
            username: obj.username,
            password: obj.password,
            database: obj.database,
            ssl: {
                ca: fs.readFileSync(__dirname + '/BaltimoreCyberTrustRoot.crt.pem')
            },
            entities: [
                __dirname + "/entity/*.ts"
            ],
            synchronize: true,
            logging: false
        });
    });
}
//# sourceMappingURL=previousMySQLFunctions.js.map