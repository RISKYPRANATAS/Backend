import { Sequelize } from "sequelize";
import db from "../config/Database.mjs";
import Users from "./UserModel.mjs";

const { DataTypes } = Sequelize;

const Portfolios = db.define(
  "portfolios",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    images: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    imagesURL: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true,
  }
);

Users.hasMany(Portfolios);
Portfolios.belongsTo(Users, { foreignKey: "userId" });

export default Portfolios;
