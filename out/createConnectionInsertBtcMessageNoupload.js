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
const fs = __importStar(require("fs"));
const BtcPriceMessage_1 = require("./entity/BtcPriceMessage");
let contentOfJson = fs.readFileSync(__dirname + '/mysqlPara.json', 'utf-8');
let obj = JSON.parse(contentOfJson);
typeorm_1.createConnection({
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
}).then((connection) => __awaiter(void 0, void 0, void 0, function* () {
    let btcMessage = new BtcPriceMessage_1.BtcPriceMessage();
    btcMessage.message = "3/15/2021: price of BTC for today: price arrange today 54555.00 USD — 60595.13 USD; current price(22:46 3/15/2021) 57069.32 USD";
    yield connection.manager.save(btcMessage);
    console.log('btcMessage has been saved' + '\n');
    connection.close();
})).catch(error => console.log(error));
//# sourceMappingURL=createConnectionInsertBtcMessageNoupload.js.map