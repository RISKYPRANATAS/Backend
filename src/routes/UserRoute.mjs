import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
} from "../controller/Users.mjs";
import { verifyUser, adminPermission } from "../middleware/AuthUser.mjs";

const router = Router();

router.get("/users", verifyUser, adminPermission, getUsers);
router.get("/users/:id", verifyUser, adminPermission, getUserById);
router.post("/users", verifyUser, adminPermission, createUser);
router.delete("/users/:id", verifyUser, adminPermission, deleteUser);

export default router;
