import { IUserInfo } from "store/userStore";

export const setCookie = (cookie: any, values: IUserInfo) => {
  // 登录失效 24h
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const path = "/";

  const { userId, nickname, avatar } = values;
  cookie.set("userId", userId || "", {
    path,
    expires,
  });
  cookie.set("nickname", nickname, {
    path,
    expires,
  });

  cookie.set("avatar", avatar, {
    path,
    expires,
  });
};

// interface ICookieProps{
//   id: number;
//   nickname: string;
//   avatar: string;
// }

// export const setCookie = (
//   cookies: any,
//   { id, nickname, avatar }: ICookieProps
// ) => {
//   //设定登录时效
//   const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
//   const path = "/";

//   cookies.set("userId", id, {
//     path,
//     expires,
//   });

//   cookies.set("nickname", nickname, {
//     path,
//     expires,
//   });

//   cookies.set("avatar", avatar, {
//     path,
//     expires,
//   });
// };
