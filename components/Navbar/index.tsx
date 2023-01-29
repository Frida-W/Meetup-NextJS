import Link from "next/link";
import { useRouter } from "next/router";
import { navLinks } from "./config";
import styles from "./index.module.scss";
import { Button, Dropdown, Avatar, Menu, message } from "antd";
import { LogoutOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useStore } from "store";
import Login from "components/Login";
import requestInstance from "service/fetch";
import { observer } from "mobx-react-lite";

const Navbar= () => {
  const store = useStore();
  const { userId, avatar, nickname } = store.user.userInfo;
  const { pathname, push } = useRouter(); 
  const [isShowLogin, setIsShowLogin] = useState(false);
  const handleGotoEditorPage = () => {
    if (!userId) {
      message.warning("Please login first");
    } else {
      push("/editor/new"); //push是一个路由跳转的api，直接填写要去的路由
    }
  };
  const handleLogin = () => {
    setIsShowLogin(true);
  };
  const handleClose = () => {
    setIsShowLogin(false);
  };
  const handleLogout = async () => {
    const res = await requestInstance.post<null, BaseDataResponse<null>>(
      "/api/user/logout" 
    );
    if (res.code === 0) {
      store.user.setUserInfo({});
      // 问题：为什么设置了直接{}是非响应式的？
      // 因为 NavBar组件不是响应式的,想要属性值跟着组件一起响应式,需要用 mobx的observer把组件包裹起来
      // 当 mobx store里面数据变化时，NavBar也会重新渲染
      // 再就是 enableStaticRendering 设置为true，浏览器端的数据变化也不会响应，需要将 enableStaticRendering 置为 enableStaticRendering(typeof window === 'undefined')
    } else {
      message.error(res.msg || "退出登录失败，请重试");
    }
  };
  const handleProfile = () => {
    push(`/user/${userId}`);
  };
  const DropDownMenu = (
    <Menu>
      <Menu.Item key="item-1">
        <UserOutlined></UserOutlined>&nbsp;{nickname}
      </Menu.Item>
      <Menu.Item key="item-2" onClick={handleProfile}>
        <HomeOutlined></HomeOutlined>&nbsp;个人主页
      </Menu.Item>
      <Menu.Item key="item-3" onClick={handleLogout}>
        <LogoutOutlined></LogoutOutlined>&nbsp;退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>BLOG-C</section>
      <section className={styles.linkArea}>
        {navLinks?.map((navLink) => (
          <Link key={navLink?.label} href={navLink?.value}>
            <span className={pathname === navLink?.value ? styles.active : ""}>
              {navLink?.label}
            </span>
          </Link>
        ))}
      </section>
      <section className={styles.operationArea}>
        <Button onClick={handleGotoEditorPage}>New Post</Button>
        {userId ? (
          <Dropdown overlay={DropDownMenu} placement="bottomLeft">
            <Avatar src={avatar}></Avatar>
          </Dropdown>
        ) : (
          <Button type="primary" onClick={handleLogin}>
            Login
          </Button>
        )}
        <Login isShow={isShowLogin} onClose={handleClose} />
      </section>
    </div>
  );
};

export default observer(Navbar);
