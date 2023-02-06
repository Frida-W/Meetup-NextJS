import { IronSession } from "iron-session";
import { IUserInfo } from "store/userStore";

//是原来Ironsession的形式，并可以支持它仍以一种key value的形式
export type ISession = IronSession & Record<string, any>;

//定义的类型来源于entity/数据库table的定义
//先定义哪些需要用到的属性类型，其他的可以后面再定义

export type IComments = {
  id: number;
  create_time: Date;
  update_time: Date;
  content: string;

};

export type IArticle = {
  id: number;
  title: string;
  content: string;
  views: number;
  create_time: Date;
  update_time: Date;
  user: IUserInfo;
  comments:IComments[];
};
