import { Router } from "express";
import { Login, Logout, getUserLogin } from "../controller/Auth.mjs";

const router = Router();

router.get("/me", getUserLogin);
router.post("/login", Login);
router.delete("/logout", Logout);

export default router;
