import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "config/index";
import getDataSource from "db";
import { User, Article } from "db/entity/index";
import { ISession } from "../../../pages/api/index";
import { EXCEPTION_ARTICLE } from "../config/codes";

//外包一层高级函数库iron-session，将密码存储到session、
export default withIronSessionApiRoute(publish, ironOptions);

async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { title = "", content = "" } = req.body;
  const db = await getDataSource();

  const userRepo = db.getRepository(User); // getRepository不用await
  const user = await userRepo.findOne({
    where: {
      //问题：为什么一定要加where？
      id: session.userId,
    },
  });

  const articleRepo = db.getRepository(Article);
  const newArticle = new Article();
  newArticle.title = title;
  newArticle.content = content;
  newArticle.create_time = new Date();
  newArticle.update_time = new Date();
  newArticle.is_delete = 0;
  newArticle.views = 0;
  //保存user的关系
  if (user) {
    newArticle.user = user;
  }
  try {
    const articleRes = await articleRepo.save(newArticle);
    res?.status(200).json({
      msg: "successful published",
      code: 0,
      data: articleRes,
    });
  } catch (error) {
    res?.status(200).json({
      ...EXCEPTION_ARTICLE.PUBLISH_FAILED,
    });
  }
}
