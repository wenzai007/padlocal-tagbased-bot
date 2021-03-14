import "reflect-metadata";
import {createConnection} from "typeorm";
import {TagCatalog} from "./entity/TagCatalog";
import * as fs from 'fs';

createConnection({
    type: "mysql",
    host: "mysqlserver4frdfunctionapp.mysql.database.azure.com",
    port: 3306,
    username: "frdmysqladmin@mysqlserver4frdfunctionapp",
    password: "Pwd123456",
    database: "wechaty_db",
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
    catalog.tag = "newtesttag2";
    catalog.autoReplyMsg = "Hi, welcome to the store!";
    catalog.scheduleMsg = "How are you recently, we are now having new product in link ===";
   
    await connection.manager.save(catalog);
    console.log('Catalog has been saved'+'\n');

  }).catch(error => console.log(error));

