import { Router } from "express";
import SessionController from "../../../../users/controllers/SessionController.js";

const sessionRoutes = Router();

sessionRoutes.post("/login", (req, res, next) => {
  SessionController.create(req, res).catch(next);
});

export { sessionRoutes };
