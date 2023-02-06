import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "config/index";
import getDataSource from "db";
import { Article, Comment, User } from "db/entity/index";
import { ISession } from "../index";
import { EXCEPTION_COMMENT } from "../config/codes";

export default withIronSessionApiRoute(publish, ironOptions);

async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;

  const { articleId = 0, content = "" } = req.body;
  const db = await getDataSource();
  const articleRepo = db.getRepository(Article);
  const commentRepo = db.getRepository(Comment);
  const userRepo = db.getRepository(User);

  const currentArticle = await articleRepo.findOne({
    where: { id: articleId },
  });
  const currentUser = await userRepo.findOne({
    where: {
      id: session.userId,
    },
  });
  const currentComment = new Comment();
  currentComment.content = content;
  currentComment.create_time = new Date();
  currentComment.update_time = new Date();
  if (currentArticle && currentUser) {
    try {
      currentComment.article = currentArticle;
      currentComment.user = currentUser;
      const response = await commentRepo.save(currentComment);
      res?.status(200).json({
        code: 0,
        msg: "successful comment",
        data: response,
      });
    } catch (error) {
      res?.status(200).json({...EXCEPTION_COMMENT.PUBLISH_FAILED});
    }
  } else {
    res?.status(200).json({ ...EXCEPTION_COMMENT.NOT_FOUND});
  }
}
