
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

require('dotenv').config();

const db_user = process.env.AIVEN_USER;
const db_password = process.env.AIVEN_PASSWORD;
const db_host =  process.env.AIVEN_HOST;
const db_port = Number(process.env.AIVEN_PORT);

const fs = require("fs");

//======= Cloud Postgres instance ===========
const config: PostgresConnectionOptions = {
    type: 'postgres',
    username: db_user, 
    password: db_password,
    host: db_host,
    port: db_port,
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync("./ca.pem").toString(),
    },
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: false,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}']
};
  
//========= Local Postgres instance ========
// const config: PostgresConnectionOptions = {
//     type: 'postgres',
//     host: 'localhost',
//     port: 5432,
//     username: 'mclone',
//     password: '123',
//     database: 'mclone',
//     entities: [__dirname + '/**/*.entity{.ts,.js}'],
//     synchronize: false,
//     migrations: [__dirname + '/migrations/**/*{.ts,.js}']
// };

export default config;