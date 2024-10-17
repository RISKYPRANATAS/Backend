import Users from "../models/UserModel.mjs";
import argon2 from "argon2";

export const getUsers = async (req, res) => {
  try {
    const response = await Users.findAll({
      attributes: ["uuid", "name", "email", "nip", "role"],
    });
    res.status(200).json({ msg: "Success", data: response });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await Users.findOne({
      attributes: ["uuid", "name", "email", "nip", "role"],
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json({ msg: "Succes", data: response });
  } catch (error) {
    res.status(404).json({ msg: "User not found" });
  }
};

export const createUser = async (req, res) => {
  const { name, email, nip, password, confPassword, role } = req.body;

  if (password !== confPassword)
    return res.status(400).json({ msg: "Password doesn't match" });
  const hashPassword = await argon2.hash(password);

  try {
    await Users.create({
      name,
      email,
      nip,
      password: hashPassword,
      role,
    });
    res.status(201).json({ msg: "Success create user" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const user = await Users.findOne({
    where: {
      uuid: req.params.id,
    },
  });

  if (!user) return res.status(404).json({ msg: "User not found" });

  try {
    await Users.destroy({
      where: {
        id: user.id,
      },
    });
    res.status(200).json({ msg: "Success deleted user" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
