import { Router } from "express";
import {
  getPortfolios,
  getPortfolioById,
  createPortfolio,
  deletePortfolio,
  updatePortfolio,
} from "../controller/Portfolios.mjs";
import { verifyUser } from "../middleware/AuthUser.mjs";

const router = Router();

router.get("/portfolios", verifyUser, getPortfolios);
router.get("/portfolios/:id", verifyUser, getPortfolioById);
router.post("/portfolios", verifyUser, createPortfolio);
router.patch("/portfolios/:id", verifyUser, updatePortfolio);
router.delete("/portfolios/:id", verifyUser, deletePortfolio);

export default router;
