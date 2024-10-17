import { Op } from "sequelize";
import Users from "../models/UserModel.mjs";
import argon2 from "argon2";

export const Login = async (req, res) => {
  const user = await Users.findOne({
    where: {
      [Op.or]: [
        { email: req.body.email || null },
        { nip: req.body.nip || null },
      ],
    },
  });

  if (!user) return res.status(404).json({ msg: "User not found" });

  const match = await argon2.verify(user.password, req.body.password);

  if (!match) return res.status(400).json({ msg: "Wrong Password" });

  req.session.userId = user.uuid;

  const uuid = user.uuid;
  const name = user.name;
  const email = user.email;
  const nip = user.nip;
  const role = user.role;

  res.status(200).json({ uuid, name, email, nip, role });
};

export const getUserLogin = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Please Login First" });
  }

  const user = await Users.findOne({
    attributes: ["uuid", "name", "email", "nip", "role"],
    where: {
      uuid: req.session.userId,
    },
  });

  if (!user) return res.status(404).json({ msg: "User not found" });

  res.status(200).json({ msg: "Success", data: user });
};

export const Logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) res.status(400).json({ msg: "Tidak dapat logout" });
    res.status(200).json({ msg: "Success Logout" });
  });
};
