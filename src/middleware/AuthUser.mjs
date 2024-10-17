import Users from "../models/UserModel.mjs";

export const verifyUser = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Please Login First" });
  }

  const user = await Users.findOne({
    where: {
      uuid: req.session.userId,
    },
  });

  if (!user) return res.status(404).json({ msg: "User not found" });

  req.userId = user.id;
  req.role = user.role;
  next();
};

export const adminPermission = async (req, res, next) => {
  const user = await Users.findOne({
    where: {
      uuid: req.session.userId,
    },
  });

  if (!user) return res.status(404).json({ msg: "User not found" });

  if (user.role !== "kaprodi")
    return res.status(403).json({ msg: "Your account does not have access" });
  next();
};
