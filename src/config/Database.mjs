import { Sequelize } from "sequelize";

const db = new Sequelize("portfolio_app", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
