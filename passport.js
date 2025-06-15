// backend/passport.js

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("./config/db");
const UserModel = require("./models/user.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await UserModel.findUserByEmail(
          profile.emails[0].value
        );

        if (existingUser) return done(null, existingUser);

        const role = req.session.selectedRole || "requester";

        const newUserId = await UserModel.createUser({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: "-",
          role,
        });

        const newUser = await UserModel.findUserById(newUserId);

        return done(null, newUser);
      } catch (err) {
        console.error("Google auth error:", err);
        done(err, null);
      }
    }
  )
);

// Серіалізація
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
