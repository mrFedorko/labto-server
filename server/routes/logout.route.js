import { Router } from "express";
import { handleLogout } from "../controllers/logoutController.js";

const logoutRouter = Router();

logoutRouter.get('/', handleLogout);

export { logoutRouter }