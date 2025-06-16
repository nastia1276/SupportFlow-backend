// app

require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");
const mySqlPool = require("./config/db");
const UserModel = require("./models/user.model");
const RequestModel = require("./models/request.model");
const CommentModel = require("./models/comment.model");
const telegramBot = require("./telegramBot");
const passport = require("./passport");
const apiRoutes = require("./routes");

// Create Express app
const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1", apiRoutes);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Test route
app.get("/test", (req, res) => {
  res.status(200).send("<h1>Humanitarian Aid Coordination System API</h1>");
});

const initializeDB = async () => {
  try {
    await UserModel.createUserTable();
    await RequestModel.createCategoriesTable();
    await RequestModel.createRequestsTable();
    await CommentModel.createCommentsTable();

    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database tables:", error);
    throw error;
  }
};

// Запуск Google Login
app.get("/auth/google", (req, res, next) => {
  req.session.oauthRole = req.query.role || "requester";
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
});

// Callback від Google
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    const jwt = require("jsonwebtoken");
    const user = req.user;

    const role = req.session.oauthRole || "requester";

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: role,
        loginType: "google",
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const db = require("./config/db");
    await db.query("UPDATE users SET role = ? WHERE id = ?", [role, user.id]);

    res.redirect(`http://localhost:5173/home?token=${token}&loginType=google`);
  }
);

// Вийти
app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

// Port
const PORT = process.env.PORT || 30598;

mySqlPool
  .query("SELECT 1")
  .then(async () => {
    console.log("MySQL Database connected!");

    await initializeDB();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

module.exports = app;
