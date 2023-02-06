//对所有api返回的code进行手边整理

export const EXCEPTION_ARTICLE = {
  PUBLISH_FAILED: {
    code: 2001,
    msg: "publish failed",
  },
  UPDATE_FAILED: {
    code: 2002,
    msg: "update failed",
  },
  NOT_FOUND: {
    code: 2003,
    msg: "Article does not exist",
  },
};

export const EXCEPTION_COMMENT = {
  PUBLISH_FAILED: {
    CODE: 4001,
    msg: "publish failed",
  },
  NOT_FOUND: {
    code: 4003,
    msg: "Article or user does not exist",
  },
};
