import { createUser } from "@/utils/mongo";
import { withSessionRoute } from "@/lib/config/withSession";
import { generateToken } from "@/utils/jwtUtils";
import { NextApiRequest, NextApiResponse } from "next";

export default withSessionRoute(clientSignUpHandler);

async function clientSignUpHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, email, password, username } = req.body;

    const expTime = 1000 * 60 * 60 * 24;

    try {
      const { userId } = await createUser({
        name,
        email,
        password,
      });

      const payload = {
        _id: userId,
        exp: Date.now() + expTime, // Set token expiration time to 1 hour
      };

      const token = await generateToken(payload);
      req.session.user = {
        _id: userId,
        token: token,
        expiration: Date.now() + expTime,
        profilePicture: "",
        type: "user",
        username: username,
        name: name,
      };
      await req.session.save();
      return res.status(200).json({
        ok: true,
        user: {
          profilePicture: "",
          name,
          _id: userId,
          type: "user",
        },
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: error.message, ok: false });
    }
  }
  return res.status(404).send("");
}
