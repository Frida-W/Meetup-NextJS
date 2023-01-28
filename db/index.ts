import "reflect-metadata";
import { DataSource } from "typeorm";
import { User, UserAuth } from "./entity/index";

const host = process.env.DATABASE_HOST;
const port = Number(process.env.DATABASE_PORT);
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_NAME;

let connectionReadyPromise: Promise<Connection> | null = null;

//导出一个数据库connection函数，它需要返回一个promise
export const prepareConnection = () => {
  const AppDataSource = new DataSource({
    type: "mysql",
    host,
    port,
    username,
    password,
    database,
    entities: [User, UserAuth],
    synchronize: false,
    logging: true,
  });

  if (!connectionReadyPromise) {
    //预判，promise不存在的话，就要进行初始化，执行一个自执行的初始化函数
    connectionReadyPromise = (async () => {
      try {
        await AppDataSource.initialize();
      } catch (error) {
        console.log(error);
      }
    })();
  }
  return connectionReadyPromise;
};

//   AppDataSource.initialize()
//   .then(() => {
//       // here you can start to work with your database
//   })
//   .catch((error) => console.log(error))

