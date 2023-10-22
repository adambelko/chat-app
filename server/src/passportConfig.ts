import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import UserModel from "./models/user";
import dotenv from "dotenv";
dotenv.config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
};

export default (passport: any) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload: any, done: any) => {
      try {
        const user = await UserModel.findOne({
          username: jwt_payload.username,
        });

        if (user) {
          return done(null, user);
        }

        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    })
  );
};
