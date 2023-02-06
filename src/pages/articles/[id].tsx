import { Avatar, Input, Button, message, Divider, Empty } from "antd";
import getDataSource from "db";
import { Article } from "db/entity";
import { IArticle } from "src/pages/api";
import styles from "./index.module.scss";
import Markdown from "markdown-to-jsx";
import { useStore } from "store/index";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { format } from "date-fns";
import { useState } from "react";
import requestInstance from "service/fetch";

interface IProps {
  article: IArticle;
}
//getServerSideProps(context),context中有个属性params，可以读取动态路由的参数
export async function getServerSideProps({ params }: any) {
  const articleId = params?.id;
  const db = await getDataSource();
  const articleRepo = db.getRepository(Article);
  const article = await articleRepo.findOne({
    where: {
      id: articleId,
    },
    relations: ["user", "comments", "comments.user"],
    //这里的名字使用的是entity中ManyToOne的关联名字
    //将relations里的数据一并存入article
  });
  //阅读次数+1
  if (article) {
    article.views = (article.views || 0) + 1; //“||” 运算符来设置默认值，以避免出现views为undefined的情况
    await articleRepo.save(article);
  }

  return {
    props: {
      article: JSON.parse(JSON.stringify(article)),
    },
  };
}

const ArticleDetail = (props: IProps) => {
  const store = useStore();
  const currentUserInfo = store?.user?.userInfo;
  const { article } = props;
  const {
    user: { nickname, avatar, id },
  } = article;
  console.log(article);
  const [inputVal, setInputVal] = useState("");
  const [comments, setComments] = useState(article?.comments || []);

  const handleComment = async () => {
    if (!inputVal) {
      message.warning("please enter your comment");
      return;
    }
    const res = await requestInstance.post<
      { articleId: number; content: string },
      BaseDataResponse<string>
    >("/api/comment/publish", {
      articleId: article?.id,
      content: inputVal,
    });
    if (res.code === 0) {
      message.success("comment successful");
      const newComments = [
        {
          id: Math.random(),//所以给一个id，防止报错
          create_time: new Date(),
          update_time: new Date(),
          content: inputVal,
          user: {
            avatar: currentUserInfo?.avatar,
            nickname: currentUserInfo?.nickname,
          },
        },
      ].concat([...comments]);
      setComments(newComments)
      setInputVal("");
    } else {
      message.error("comment failed");
    }
  };

  return (
    <div>
      {/* ------文章详情----- */}
      <div className="content-layout">
        <h2 className={styles.title}>{article?.title}</h2>
        <div className={styles.user}>
          <Avatar src={avatar} size={50} />
          <div className={styles.info}>
            <div className={styles.name}>{nickname}</div>
            <div className={styles.detail}>
              <div className={styles.date}>
                Update at:
                <span>
                  {format(
                    new Date(article?.update_time),
                    "yyyy-mm-dd hh:mm:ss"
                  )}
                </span>
              </div>
              <div className={styles.date}>
                &nbsp;&nbsp;Views:<span>{article?.views}</span>
              </div>
              <div>
                {Number(currentUserInfo?.userId) === Number(id) && (
                  <Link href={`/editor/${article.id}`}>&nbsp;&nbsp;Editor</Link>
                )}
              </div>
            </div>
          </div>
        </div>
        <Markdown className={styles.content}>{article.content}</Markdown>
      </div>

      {/* ------文章评论----- */}
      <div className={`content-layout ${styles.comment}`}>
        <div className={styles.commentTitle}>
          <h3>评论</h3>
          {currentUserInfo?.userId && (
            <div className={styles.enter}>
              <Avatar src={avatar} size={40} />
              <div className={styles.content}>
                <Input.TextArea
                  placeholder="Please enter comments"
                  rows={4}
                  value={inputVal}
                  onChange={(e) => {
                    setInputVal(e?.target?.value);
                  }}
                />
                <Button type="primary" onClick={handleComment}>
                  Publish comment
                </Button>
              </div>
            </div>
          )}
          {/* 评论展示 */}
          <Divider />
          <div className={styles.display}>
            {comments?.length ? (
              comments.map((comment) => {
                return (
                  <div className={styles.wrapper} key={comment.id}>
                    <Avatar src={comment?.user?.avatar} size={40}></Avatar>
                    <div className={styles.info}>
                      <div className={styles.name}>
                        <div>{comment?.user?.nickname}</div>
                        <div className={styles.date}>
                          {format(
                            new Date(comment?.update_time),
                            "yyyy-MM-dd hh:mm:ss"
                          )}
                        </div>
                      </div>
                      <div className={styles.content}>{comment?.content}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <Empty description={"评论列表为空"} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(ArticleDetail);
