import bcrypt from "bcryptjs";
import { AppError } from "../../shared/errors/AppError.js";
import UserRepository from "../repositories/UserRepository.js";
import { isValidEmail } from "../utils/isValidEmail.js";

class UserPasswordResetService {
  async execute({ email, resetCode, password }) {
    const trimmedEmail = email?.trim().toLowerCase();

    if (!trimmedEmail || !resetCode || !password) {
      throw new AppError(
        "E-mail, código de recuperação e nova senha são obrigatórios.",
        400,
      );
    }

    if (!isValidEmail(trimmedEmail)) {
      throw new AppError("Informe um e-mail válido.", 400);
    }

    if (password.length < 6) {
      throw new AppError("A senha deve ter no mínimo 6 caracteres.", 400);
    }

    const expectedCode = process.env.PASSWORD_RESET_CODE || "1234";
    if (String(resetCode) !== String(expectedCode)) {
      throw new AppError("Código de recuperação inválido.", 400);
    }

    const user = await UserRepository.findByEmail(trimmedEmail);
    if (!user) {
      throw new AppError("Nenhum usuário encontrado com este e-mail.", 404);
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    await UserRepository.updatePassword(trimmedEmail, hashedPassword);

    return { message: "Senha atualizada com sucesso!" };
  }
}

export default new UserPasswordResetService();
