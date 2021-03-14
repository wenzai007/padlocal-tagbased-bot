import "reflect-metadata";
import {createConnection} from "typeorm";
import {TagCatalog} from "./entity/TagCatalog";
import * as fs from 'fs';

interface MyObj {
    host: string;
    username: string;
    password: string;
    database: string;
}

let contentOfJson: string = fs.readFileSync(__dirname + '/mysqlPara.json', 'utf-8');
let obj: MyObj = JSON.parse(contentOfJson);

createConnection({
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
  }).then(async connection => {
   
    let catalog = new TagCatalog();
    catalog.tag = "newtesttagForHidden";
    catalog.autoReplyMsg = "Hi, welcome to the store!";
    catalog.scheduleMsg = "How are you recently, we are now having new product in link ===";
   
    await connection.manager.save(catalog);
    console.log('Catalog has been saved'+'\n');

  }).catch(error => console.log(error));

