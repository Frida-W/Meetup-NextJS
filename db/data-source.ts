import "reflect-metadata"; // todo 用处
import { DataSource, DataSourceOptions } from "typeorm"
import { User, UserAuth, Article, Comment} from "./entity";

export const AppDataSource = new DataSource({
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    // 把涉及的表引进来
    entities: [
        User,
        UserAuth,
        Article,
        Comment,
    ],
    synchronize: false,
    logging: false,
    subscribers: [],
    migrations: [],
} as DataSourceOptions)