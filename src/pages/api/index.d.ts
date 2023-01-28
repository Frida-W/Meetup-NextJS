import {IronSession} from "iron-session";

//是原来Ironsession的形式，并可以支持它仍以一种key value的形式
export type ISession = IronSession & Record<string, any> 