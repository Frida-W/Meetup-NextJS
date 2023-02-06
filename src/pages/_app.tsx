import "@/styles/globals.css";
import Layout from "components/Layout";
import { StoreProvider } from "store/index";
import { NextPage } from "next";
import request from "service/fetch";

interface IProps {
  initialValue: Record<any, any>; // key-value类型
  Component: NextPage; //Next.js定义了一个类型别名 NextPage 来表示页面组件，它等同于 React.FunctionComponent 。
  pageProps: any;
}

export default function MyApp({ initialValue, Component, pageProps }: IProps) {
  //component的layout属性为null，则该页面不需要Layout包裹渲染
  const renderLayout = () => {
    if ((Component as any).layout === null) {
      return <Component {...pageProps} />;   //固定写法
    } else {
      return (
        <Layout>  
          <Component {...pageProps} /> 
        </Layout>
      );
    }
  };
  return (
    //provider拿到initial value后去store/index中调用createStore方法
    <StoreProvider initialValue={initialValue}>
      {renderLayout()}
    </StoreProvider>
  );
}

//使用getInitialProps类属性, 因为用ssr渲染，所以可以接受一个ctx，使用ctx.req.cookies中可以拿到cookie
MyApp.getInitialProps = async ({ ctx }: { ctx: any }) => {
  // console.log(ctx?.req?.cookies) 可以打印出浏览器中cookies里存储的所有内容，注意这里要用cookies
  const { userId, nickname, avatar } = ctx?.req?.cookies || {};

  return {
    initialValue: {
      user: {
        userInfo: {
          userId,
          nickname,
          avatar,
        },
      },
    },
  };
};
