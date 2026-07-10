import jwt from "jsonwebtoken";
import { authConfig } from "../config/auth.js";
import { AppError } from "../src/modules/shared/errors/AppError.js";

export function authMiddleware(req, _res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError("Token não informado.", 401));
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new AppError("Token malformado.", 401));
  }

  try {
    const decoded = jwt.verify(token, authConfig.secret);
    req.userId = decoded.id;
    return next();
  } catch {
    return next(new AppError("Token inválido.", 401));
  }
}
