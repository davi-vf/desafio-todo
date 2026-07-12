import bcrypt from "bcryptjs";
import { AppError } from "../../shared/errors/AppError.js";
import UserRepository from "../repositories/UserRepository.js";
import { isValidEmail } from "../utils/isValidEmail.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";

const MAX_NAME_LENGTH = 80;

class UserCreateService {
  async execute({ name, email, password }) {
    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !password) {
      throw new AppError("Nome, e-mail e senha são obrigatórios.", 400);
    }

    if (!isValidEmail(trimmedEmail)) {
      throw new AppError("Informe um e-mail válido.", 400);
    }

    if (trimmedName.length > MAX_NAME_LENGTH) {
      throw new AppError("O nome deve ter no máximo 80 caracteres.", 400);
    }

    if (password.length < 6) {
      throw new AppError("A senha deve ter no mínimo 6 caracteres.", 400);
    }

    const existing = await UserRepository.findByEmail(trimmedEmail);
    if (existing) {
      throw new AppError("Já existe um usuário com este e-mail.", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await UserRepository.create({
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
    });

    return sanitizeUser(user);
  }
}

export default new UserCreateService();
