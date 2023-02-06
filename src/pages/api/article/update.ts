import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "config/index";
import getDataSource from "db";
import { Article } from "db/entity/index";
// import { ISession } from "../../../pages/api/index";
import { EXCEPTION_ARTICLE } from "../config/codes";

//外包一层高级函数库iron-session，将密码存储到session、
export default withIronSessionApiRoute(update, ironOptions);

async function update(req: NextApiRequest, res: NextApiResponse) {
  //   const session: ISession = req.session;
  const { id = 0, title = "", content = "" } = req.body; //=""是指默认给他们一个值
  const db = await getDataSource();

  const articleRepo = db.getRepository(Article); // getRepository不用await
  const article = await articleRepo.findOne({
    where: {
      //问题：为什么一定要加where？
      id,
    },
    relations: ["user"],
  });

  if (article) {
    article.title = title,
    article.content = content,
    article.update_time = new Date();

    const response = await articleRepo.save(article);
    if(response){
        res?.status(200).json({
            msg: "successfully update",
            code: 0,
            data: response,
          });
    }else{
        res?.status(200).json({
            ...EXCEPTION_ARTICLE.UPDATE_FAILED,
          });
    }
 } else{
    res?.status(200).json({...EXCEPTION_ARTICLE.NOT_FOUND});
}}