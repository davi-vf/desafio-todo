import { Router } from "express";
import UserController from "../../../../users/controllers/UserController.js";

const userRoutes = Router();

userRoutes.post("/", (req, res, next) => {
  UserController.create(req, res).catch(next);
});

userRoutes.post("/password/reset", (req, res, next) => {
  UserController.resetPassword(req, res).catch(next);
});

export { userRoutes };
