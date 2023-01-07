import { Router } from "express";
import { handleRefreshToken } from "../controllers/refreshTokenController.js";

const refreshTokenRouter = Router();

refreshTokenRouter.get('/', handleRefreshToken);

export {refreshTokenRouter};