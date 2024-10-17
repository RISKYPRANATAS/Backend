import express from "express";
import cors from "cors";
import session from "express-session";
import FileUpload from "express-fileupload";
import dotenv from "dotenv";
import UserRoute from "./routes/UserRoute.mjs";
import PortfolioRoute from "./routes/PortfolioRoute.mjs";
import AuthRoute from "./routes/AuthRoute.mjs";
import SequelizeStore from "connect-session-sequelize";
import db from "./config/Database.mjs";

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

// (async () => {
//   await db.sync();
// })();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: { secure: "auto" },
  })
);

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:5174"],
  })
);

app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));
app.use("/api", UserRoute);
app.use("/api", PortfolioRoute);
app.use("/api", AuthRoute);

// store.sync();

app.listen(process.env.APP_PORT, () => {
  console.log(`Server running on port ${process.env.APP_PORT}`);
});
