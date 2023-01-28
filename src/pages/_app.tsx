import "@/styles/globals.css";
// import type { AppProps } from "next/app";
import Layout from "components/Layout";
import { StoreProvider } from "store/index";
import { NextPage } from "next";

interface IProps {
  initialValue: Record<any, any>; // key-value类型
  Component: NextPage; //Next.js定义了一个类型别名 NextPage 来表示页面组件，它等同于 React.FunctionComponent 。
  pageProps: any;
}

export default function MyApp({ initialValue, Component, pageProps }: IProps) {
  return (
    <StoreProvider initialValue={initialValue}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StoreProvider>
  );
}

//使用getInitialProps类属性, 因为用ssr渲染，所以可以接受一个ctx，使用ctx.req.cookies中可以拿到cookie
MyApp.getInitialProps = async ({ ctx }: { ctx: any }) => {
  //any是省事的做法，最完美的做法是把每个类型都定义好
  const { id, nickname, avatar } = ctx?.req.cookies || {}; // 或是空对象，以免拿不到cookies而报错
  return {
    initialValue: {
      user: {
        userInfo: {
          id,
          nickname,
          avatar,
        },
      },
    },
  };
};
