import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { shortIronOptions, LongIronOptions } from "./iron-config";

export function withSessionRoute(handler: any, rememberMe: boolean = false) {
  // console.log(rememberMe);
  const options = rememberMe ? LongIronOptions : shortIronOptions;
  return withIronSessionApiRoute(handler, options);
}

export function withSessionSsr(handler: any, rememberMe: boolean = false) {
  const options = rememberMe ? LongIronOptions : shortIronOptions;
  return withIronSessionSsr(handler, options);
}

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      token: string;
      type: string;
      _id: string;
      expiration: number; // 24 hour in milliseconds,
      username: string;
      name: string;
      profilePicture: string;
    };
  }
}
