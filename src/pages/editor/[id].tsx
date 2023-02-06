import type { NextPage } from "next";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { MDEditorProps } from "@uiw/react-md-editor";
import dynamic from "next/dynamic";
import { ChangeEvent, useState } from "react";
import styles from "./index.module.scss";
import { Button, Input, message } from "antd";
import requestInstance from "service/fetch";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useStore } from "store"; //问题？为什么这里不用redux tlk
import getDataSource from "db";
import { Article } from "db/entity";
import { IArticle } from "src/pages/api";

interface IProps {
  article: IArticle;
}

export async function getServerSideProps({ params }: any) {
  const articleId = params?.id;
  const db = await getDataSource();
  const articleRepo = db.getRepository(Article);
  const article = await articleRepo.findOne({
    where: {
      id: articleId,
    },
    relations: ["user"],
  });

  return {
    props: {
      article: JSON.parse(JSON.stringify(article)),
    },
  };
}

const MDEditor: NextPage = dynamic<MDEditorProps>(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

const ModifyEditor = ({ article }: IProps) => {
//   const store = useStore();
//   const { userId } = store.user.userInfo;
  const [title, setTitle] = useState(article?.title || "");
  const [content, setContent] = useState(article?.title || "");
  const { push} = useRouter();
//   console.log(11111);
//   console.log(article.id)
//   console.log(222);
//   console.log(query)

  const handlePublish = async () => {
    if (!title) {
      message.warning("please enter your blog title");
      return;
    }
    const res = await requestInstance.post<any, BaseDataResponse<any>>(
      "/api/article/update",
      {
        id:article.id,
        title,
        content,
      }
    );
    if (res?.code === 0) {
      article.id ? push(`/articles/${article.id}`) : push(`/`);
      message.success(res?.msg || "更新成功");
    } else {
      message.error(res?.msg || "发布失败");
    }
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    //ChangeEvent<HTMLInputElement>是一个泛型
    setTitle(e?.target?.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input
          className={styles.title}
          placeholder="Type your blog title"
          value={title}
          onChange={handleTitleChange}
        ></Input>
        <Button
          className={styles.button}
          type="primary"
          onClick={handlePublish}
        >
          Publish
        </Button>
      </div>
      <MDEditor value={content} height={1080} onChange={setContent} />
    </div>
  );
};
(ModifyEditor as any).layout = null;
export default observer(ModifyEditor);
