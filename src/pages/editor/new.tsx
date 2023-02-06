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

const MDEditor: NextPage = dynamic<MDEditorProps>(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

const NewEditor = () => {
  const store = useStore();
  const {userId} = store.user.userInfo
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const {push} = useRouter()

  const handlePublish = async () => {
    if (!title) {
      message.warning("please enter your blog title");
      return;
    }
    //如何获取 title content？不用另行获取，数据已经被usestate维护在组件状态内了
    const res = await requestInstance.post<any, BaseDataResponse<any>>("/api/article/publish", {
      title,
      content,
    });
    if (res?.code === 0) {
      userId?push(`/user/${userId}`):push(`/`)
      message.success(res?.msg || "发布成功");
      } else {
      message.error(res?.msg || "发布失败");
    }
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => { //ChangeEvent<HTMLInputElement>是一个泛型                 
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

// 问题：在编辑器页面，不希望显示顶部的导航栏 layOut 该怎么办？
// 用属性 layout 确认是否要显示导航栏，并在 _app.tsx 中使用这个属性判断是否要展示导航栏
(NewEditor as any).layout = null;
export default observer(NewEditor);
