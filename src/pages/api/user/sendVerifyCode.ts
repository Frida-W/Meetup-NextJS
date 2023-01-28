import { NextApiRequest, NextApiResponse } from "next";
import { format } from "date-fns";
import md5 from "md5";
import { encode } from "js-base64";
import request from "service/fetch";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "config/index";
import { ISession } from "../../../pages/api/index";

//外包一层高级函数库iron-session，将密码存储到session、
export default withIronSessionApiRoute(sendVerifyCode, ironOptions);

async function sendVerifyCode(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session; //外包withIronSessionApiRoute后，req中会存在一个session属性
  const { to = "", templateId = "1" } = req.body;
  const AccountId = "2c94811c85c276590185f022720902c0";
  const AuthToken = "20309b95c8f64ea8ade9eac126462ef1";
  const AppId = "2c94811c85c276590185f02272de02c7";
  const NowDate = format(new Date(), "yyyyMMddHHmmss");
  const SigParameter = md5(`${AccountId}${AuthToken}${NowDate}`);
  const Authorization = encode(`${AccountId}:${NowDate}`);
  const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  const expireMinute = "5";
  const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountId}/SMS/TemplateSMS?sig=${SigParameter}`;
  console.log(NowDate);
  console.log(to);
  console.log(templateId);
  console.log(Authorization);
  console.log(SigParameter);

  const response = await request.post(
    url,
    {
      to,
      templateId,
      appId: AppId,
      datas: [verifyCode, expireMinute],
    },
    {
      headers: {
        Authorization,
      },
    }
  );
  const { statusCode, statusMsg } = response as any;

  if (statusCode === "000000") {
    session.verifyCode = verifyCode;
    await session.save();
    res.status(200).json({
        code: 0,
        msg: statusMsg,
      });
  } else {
    res.status(200).json({
      code: statusCode,
      msg: statusMsg,
    });
  }
}
