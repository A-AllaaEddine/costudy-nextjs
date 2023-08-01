export const shortIronOptions = {
  cookieName: process.env.IRON_SESSION_COOKIE_NAME,
  password: process.env.IRON_SESSION_PASSWORD,
  ttl: 60 * 60 * 24,
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production" ? true : false,
    httpOnly: true,
  },
};
export const LongIronOptions = {
  cookieName: process.env.IRON_SESSION_COOKIE_NAME,
  password: process.env.IRON_SESSION_PASSWORD,
  ttl: 60 * 60 * 24 * 7,
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production" ? true : false,
  },
};
