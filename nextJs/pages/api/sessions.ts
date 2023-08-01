import { generateToken, verifyToken } from "@/utils/jwtUtils";
import { withSessionRoute } from "../../lib/config/withSession";
import { verifyUser } from "@/utils/mongo";
import { NextApiRequest, NextApiResponse } from "next";

export default async function withRememberMeHandle(req, res) {
  const { rememberMe } = req.body;
  return await withSessionRoute(createSessionRoute, rememberMe)(req, res);
}

async function createSessionRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, password, rememberMe } = req.body;
    const user = req.session.user;

    const expTime = rememberMe ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 60 * 24; // 2 min in milliseconds

    if ((!email || !password) && (!user || !user.token || !user.expiration)) {
      // console.log("case 1");
      return res
        .status(320)
        .json({ ok: false, error: "Unauthorized", noSession: true });
    }

    try {
      if (email && password) {
        const {
          result,
          userId,
          type,
          username,
          profilePicture,
          passwordNotMatching,
          status,
          name,
        } = await verifyUser(email, password);
        if (result) {
          const payload = {
            _id: userId,
            exp: Math.floor(Date.now() / 1000) + expTime / 1000, // Set token expiration time to 1 hour
          };

          const token = await generateToken(payload);
          req.session.user = {
            token: token,
            type: type,
            _id: userId,
            name: name,
            username: username,
            expiration: Date.now() + expTime,
            profilePicture: profilePicture,
          };
          await req.session.save();
          return res.status(200).json({
            ok: true,
            user: {
              token: token,
              type: type,
              _id: userId,
              name: name,
              username: username,
              expiration: Date.now() + expTime,
              profilePicture: profilePicture,
            },
          });
        } else {
          if (passwordNotMatching) {
            return res.status(320).json({
              ok: false,
              error: "Wrong Password",
              passwordNotMatching: true,
            });
          }
          if (status === "suspended") {
            return res.status(320).json({ ok: false, error: "suspended" });
          }
          if (status === "banned") {
            return res.status(320).json({ ok: false, error: "banned" });
          }
          req.session.destroy();
          return res
            .status(320)
            .json({ ok: false, error: "No user", noSession: true });
        }
      }

      if (user && Date.now() >= user.expiration + 3600000) {
        // req.session.destroy();
        const { userId } = await verifyToken(user.token);
        const payload = {
          _id: userId,
          exp: Math.floor(Date.now() / 1000) + expTime / 1000,
        };

        const token = await generateToken(payload);
        req.session.user = {
          token: token,
          type: user.type,
          _id: userId,
          expiration: Date.now() + expTime, // 24 hour in milliseconds,
          username: user.username,
          name: user.name,
          profilePicture: user.profilePicture,
        };
        await req.session.save();
        // return res
        //   .status(401)
        //   .json({ ok: false, error: "Unauthorized", isExpired: true });
      }

      return res.status(200).json({ ok: true, user: req.session.user });
    } catch (error) {
      req.session.destroy();
      console.log(error);
      return res.status(500).json({ error: error.message, ok: false });
    }
  }

  return res.status(404).send("Unsupported method");
}
