import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "config/index";
import getDataSource from "db";
import { User, UserAuth } from "db/entity/index";
import { ISession } from "../../../pages/api/index";
import { Cookie } from "next-cookie"; //用cookie记录登录状态 https://www.npmjs.com/package/next-cookie 同构库，node和前端都可以使用，和axios一样
import { setCookie } from "utils/cookie";
import {
  REGISTER_SAVE_FAIL,
} from "utils/err-code";

export default withIronSessionApiRoute(login, ironOptions);

async function login(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const cookie = Cookie.fromApiRoute(req, res); //先用Cookie包引用一个cookie，把cookie注入到req里，
  const { phone = "", verify = "", identity_type = "phone" } = req.body;
  const db = await getDataSource();
  const userAuthRepo = db.getRepository(UserAuth);

  if (String(session.verifyCode) === String(verify)) {
    const userAuth = await userAuthRepo.findOne({
      where: {
        identity_type,
        identifier: phone,
      },
      relations: ["user"], // 在userAuthEntity 那儿定义的链接名称user，会把 auth表的userId对应的那个user数据一起返回
    });
    if (userAuth) {
      //已存在用户，保存登录态
      const user = userAuth.user;
      const { id, nickname, avatar } = user as User;
      session.userId = id;
      session.nickname = nickname;
      session.avatar = avatar;
      await session.save();
      setCookie(cookie, { userId:id, nickname, avatar });//提前封装好setCookie方法，之后就不用重复写

      res.status(200).json({
        code: 0,
        msg: "登录成功",
        data: {
          userId: id,
          nickname,
          avatar,
        },
      });
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

      try {
        const resUserAuth = await userAuthRepo.save(userAuth); // 因为在 entity 里面设置了 cascade: true ，所以这里只需要保存userAuth，就会把user一块帮忙save
        const { id, nickname, avatar } = resUserAuth.user as User;
        session.userId = id;
        session.nickname = nickname;
        session.avatar = avatar;
        await session.save();
        setCookie(cookie, { userId:id, nickname, avatar })

        res?.status(200).json({
          msg: "successfully login",
          code: 0,
          data: {
            userId: id,
            nickname,
            avatar,
          },
        });
      } catch (error) {
        res.status(200).json({
          code: REGISTER_SAVE_FAIL,
          msg: "注册并登录失败",
          data: error,
        });
      }
    }
  } else {
    res?.status(200).json({ msg: "wrong verify code", code: -1 });
  }
}
