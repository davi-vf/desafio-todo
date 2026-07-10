import { prisma } from "../../../../lib/prisma.js";

class UserRepository {
  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id) {
    return prisma.user.findUnique({ where: { id } });
  }

  async create({ name, email, password }) {
    return prisma.user.create({
      data: { name, email, password },
    });
  }

  async updatePassword(email, password) {
    return prisma.user.update({
      where: { email },
      data: { password },
    });
  }
}

export default new UserRepository();
