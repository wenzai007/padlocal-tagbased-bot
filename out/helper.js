"use strict";
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
exports.dingDongBot = exports.getMessagePayload = exports.LOGPRE = void 0;
const wechaty_1 = require("wechaty");
const PUPPET = __importStar(require("wechaty-puppet"));
exports.LOGPRE = "[PadLocalDemo]";
function getMessagePayload(message) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (message.type()) {
            case PUPPET.types.Message.Text:
                wechaty_1.log.silly(exports.LOGPRE, `get message text: ${message.text()}`);
                break;
            case PUPPET.types.Message.Attachment:
            case PUPPET.types.Message.Audio: {
                const attachFile = yield message.toFileBox();
                const dataBuffer = yield attachFile.toBuffer();
                wechaty_1.log.info(exports.LOGPRE, `get message audio or attach: ${dataBuffer.length}`);
                break;
            }
            case PUPPET.types.Message.Video: {
                const videoFile = yield message.toFileBox();
                const videoData = yield videoFile.toBuffer();
                wechaty_1.log.info(exports.LOGPRE, `get message video: ${videoData.length}`);
                break;
            }
            case PUPPET.types.Message.Emoticon: {
                const emotionFile = yield message.toFileBox();
                const emotionJSON = emotionFile.toJSON();
                wechaty_1.log.info(exports.LOGPRE, `get message emotion json: ${JSON.stringify(emotionJSON)}`);
                const emotionBuffer = yield emotionFile.toBuffer();
                wechaty_1.log.info(exports.LOGPRE, `get message emotion: ${emotionBuffer.length}`);
                break;
            }
            case PUPPET.types.Message.Image: {
                const messageImage = yield message.toImage();
                const thumbImage = yield messageImage.thumbnail();
                const thumbImageData = yield thumbImage.toBuffer();
                wechaty_1.log.info(exports.LOGPRE, `get message image, thumb: ${thumbImageData.length}`);
                const hdImage = yield messageImage.hd();
                const hdImageData = yield hdImage.toBuffer();
                wechaty_1.log.info(exports.LOGPRE, `get message image, hd: ${hdImageData.length}`);
                const artworkImage = yield messageImage.artwork();
                const artworkImageData = yield artworkImage.toBuffer();
                wechaty_1.log.info(exports.LOGPRE, `get message image, artwork: ${artworkImageData.length}`);
                break;
            }
            case PUPPET.types.Message.Url: {
                const urlLink = yield message.toUrlLink();
                wechaty_1.log.info(exports.LOGPRE, `get message url: ${JSON.stringify(urlLink)}`);
                const urlThumbImage = yield message.toFileBox();
                const urlThumbImageData = yield urlThumbImage.toBuffer();
                wechaty_1.log.info(exports.LOGPRE, `get message url thumb: ${urlThumbImageData.length}`);
                break;
            }
            case PUPPET.types.Message.MiniProgram: {
                const miniProgram = yield message.toMiniProgram();
                wechaty_1.log.info(exports.LOGPRE, `MiniProgramPayload: ${JSON.stringify(miniProgram)}`);
                break;
            }
        }
    });
}
exports.getMessagePayload = getMessagePayload;
function dingDongBot(message) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (((_a = message.to()) === null || _a === void 0 ? void 0 : _a.self()) && message.text().indexOf("ding") !== -1) {
            yield message.talker().say(message.text().replace("ding", "dong"));
        }
    });
}
exports.dingDongBot = dingDongBot;
//# sourceMappingURL=helper.js.map