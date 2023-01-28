import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { navLinks } from "./config";
import styles from "./index.module.scss";
import { Button } from "antd";
import { useState } from "react";
import Login from "components/Login";

const Navbar: NextPage = () => {
  const { pathname } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);
  const handleGotoEditorPage = () => {

  };
  const handleLogin = () => {
    setIsShowLogin(true);
  };
  const handleClose = () => {
    setIsShowLogin(false);
  };

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
        <Button type="primary" onClick={handleLogin}>
          Login
        </Button>
        <Login isShow={isShowLogin} onClose={handleClose} />
      </section>
    </div>
  );
};

export default Navbar;
