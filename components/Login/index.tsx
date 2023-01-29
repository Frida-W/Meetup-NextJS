import styles from "./index.module.scss";
import { useState } from "react";
import CountDown from "../CountDown";
import { message } from "antd";
import requestInstance from "service/fetch";
// 使用useStore的组件，都用  observer 包裹一下，保证响应式
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import { GithubCallbackUrl } from 'utils/const';

interface IProps {
  isShow: boolean;
  onClose: Function;
}

const Login = (props: IProps) => {
  const store = useStore();
  const { isShow = false, onClose } = props;
  const [isShowVerifyCode, setIsShowVerifyCode] = useState(false);
  const [form, setForm] = useState({
    phone: "",
    verify: "",
  });

  const handleClose = () => {
    onClose && onClose();
  };

  const handleGetVerifyCode = () => {
    // setIsShowVerifyCode(true);
    if (!form?.phone) {
      message.warning("Please enter your phone number");
      return;
    }
    requestInstance
      .post("/api/user/sendVerifyCode", {
        to: form?.phone,
        templateId: 1,
      })
      .then((res) => {
        if (res?.code === 0) {
          setIsShowVerifyCode(true);
        } else {
          message.error(res?.msg || "unknown message");
        }
      });
  };

  const handleLogin = () => {
    if (!form.phone || !form.verify) {
      message.warning("Please enter phone and verify code");
      return;
    }
    requestInstance
      .post("/api/uer/login", {
        ...form,
        identity_type: "phone"
      }).then((res) => {
        if (res.code === 0) {
              // 登陆成功
              message.success(res.msg);
              store.user.setUserInfo(res?.data);
              setForm({
                  phone: '',
                  verify: '',
              });
              handleClose();
        } else {
          message.error(res?.msg || "unknown message");
        }
      })
  };

  const handleOAuthGithub = () => {
    window.location.href = GithubCallbackUrl;
  };
  const handleCountDownEnd = () => {
    setIsShowVerifyCode(false);
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e?.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  return (
    isShow && (
      <div className={styles.loginArea}>
        <div className={styles.loginBox}>
          <div className={styles.loginTitle}>
            <div>Mobile Login</div>
            <div className={styles.close} onClick={handleClose}>
              x
            </div>
          </div>
          <input
            name="phone"
            type="text"
            placeholder="Enter phone number"
            value={form.phone}
            className={styles.input}
            onChange={handleFormChange}
          ></input>
          <div className={styles.verifyCodeArea}>
            <input
              name="verify"
              type="text"
              placeholder="Enter verify code"
              value={form.verify}
              onChange={handleFormChange}
            ></input>
            <span className={styles.verifyCode} onClick={handleGetVerifyCode}>
              {isShowVerifyCode ? (
                <CountDown time={10} onEnd={handleCountDownEnd} />
              ) : (
                "Get Code"
              )}
            </span>
          </div>

          <div className={styles.loginBTN} onClick={handleLogin}>
            Login
          </div>
          <div className={styles.otherLogin} onClick={handleOAuthGithub}>
            Login with github
          </div>
          <div className={styles.loginPrivacy}>
            By registering, you agree to
            <a href="" target="_blank">
              Private Policy
            </a>
          </div>
        </div>
      </div>
    )
  );
};

export default observer(Login);
