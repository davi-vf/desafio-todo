import { prisma } from "../../../../lib/prisma.js";

class TaskRepository {
  async findAllByUser(userId) {
    return prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByIdForUser(id, userId) {
    return prisma.task.findFirst({
      where: { id, userId },
    });
  }

  async create({ title, description, category, userId }) {
    return prisma.task.create({
      data: { title, description, category, userId },
    });
  }

  async update(id, data) {
    return prisma.task.update({
      where: { id },
      data,
    });
  }

  async remove(id) {
    return prisma.task.delete({ where: { id } });
  }
}

export default new TaskRepository();
