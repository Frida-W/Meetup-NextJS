import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "config/index";
import { prepareConnection } from "db";
import { User, UserAuth } from "db/entity/index";
import { ISession } from "../../../pages/api/index";
import { Cookie } from "next-cookie"; // https://www.npmjs.com/package/next-cookie 同构库，node和前端都可以使用，和axios一样
import { setCookie } from "utils";

export default withIronSessionApiRoute(login, ironOptions);

async function login(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const cookies = Cookie.fromApiRoute(req,res) //先用Cookie包引用一个cookie，把cookie带到req里，
  const { phone = "", verify = "", identity_type = "phone" } = req.body;
  const db = await prepareConnection();
  const userAuthRepo = db.getRepository(UserAuth);

  if (String(session.verifyCode) === String(verify)) {
    const userAuth = await userAuthRepo.findOne(
      {
        identity_type,
        identifier: phone,
      },
      {
        relations: ["user"],
      }
    );
    if (userAuth) {
        //已存在用户
      const user = userAuth.user;
      const { id, nickname, avatar } = user;

      session.userId = id;
      session.nickname = nickname;
      session.avatar = avatar;

      await session.save();
      setCookie(cookies, {id, nickname, avatar }) //使用utils里的工具函数setCookie
    } else {
      const user = new User();
      user.nickname = `user_${Math.floor(Math.random() * 10000)}`; //由于目前用户用第三方登录，所以先为其生成一个随机用户名
      user.avatar = "/images/avatar.svg";
      user.job = "none";
      user.introduce = "none";

      const userAuth = new UserAuth();
      userAuth.identity_type = identity_type;
      userAuth.identifier = phone;
      userAuth.credential = session.verifyCode;
      userAuth.user = user; //userAuth is a many to one type table

      const resUserAuth = await userAuthRepo.save(userAuth); // casacade is true, 所以保存userAuth时，会把user也保存
      const {
        user: { id, nickname, avatar },
      } = resUserAuth;

      session.userId = id;
      session.nickname = nickname;
      session.avatar = avatar;

      await session.save();
      setCookie(cookies, {id, nickname, avatar }) 

      res?.status(200).json({
        msg: "successfully login",
        code: 0,
        data: {
          userId: id,
          nickname,
          avatar,
        },
      });
    }
  } else {
    res?.status(200).json({ msg: "wrong verify code", code: -1 });
  }
}
