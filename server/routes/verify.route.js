import { Router } from "express";
import { handleVerify } from "../controllers/verifyController.js";

const verifyRouter = Router();

verifyRouter.get(
    '/:key',
    handleVerify
)

export { verifyRouter }