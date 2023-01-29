import { AppDataSource } from "./data-source";

//导出链接数据库的function
async function getDataSource() {
    try {
        if(!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
    } catch (error) {
        console.log('AppDataSource.initialize', error);
    }
    return AppDataSource;
}

export default getDataSource;