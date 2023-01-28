//config保存常用的文件配置
export const ironOptions = {
  cookieName: process.env.SESSION_COOKIE_NAME as string,
  password: process.env.SESSION_PASSWORD as string,
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    maxAge: 24 * 60 * 60 * 1000, //设置有效时间一天，单位是毫秒
    secure: process.env.NODE_ENV === "production",
  },
};
