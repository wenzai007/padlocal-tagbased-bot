"use strict";
// bot.ts
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
const wechaty_puppet_padlocal_1 = require("wechaty-puppet-padlocal");
const wechaty_1 = require("wechaty");
const token = "puppet_padlocal_85f584183cb345459e3de985e01b0fe5"; // padlocal token
const puppet = new wechaty_puppet_padlocal_1.PuppetPadlocal({ token });
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
})
    .on("logout", (user) => {
    console.log(`${user} logout`);
})
    .on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`on message: ${message.toString()}`);
}))
    .start();
console.log("TestBot", "started");
//# sourceMappingURL=bot.js.map