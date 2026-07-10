import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authConfig } from "../../../../config/auth.js";
import { AppError } from "../../shared/errors/AppError.js";
import UserRepository from "../repositories/UserRepository.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";

class AuthenticateUserService {
  async execute({ email, password }) {
    const trimmedEmail = email?.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      throw new AppError("E-mail e senha são obrigatórios.", 400);
    }

    const user = await UserRepository.findByEmail(trimmedEmail);

    if (!user) {
      throw new AppError("E-mail ou senha incorretos.", 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new AppError("E-mail ou senha incorretos.", 401);
    }

    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    return {
      user: sanitizeUser(user),
      token,
    };
  }
}

export default new AuthenticateUserService();
