import "dotenv/config";

const jwtSecret = process.env.JWT_SECRET || "taskflix-dev-secret-change-me";

export const authConfig = {
  secret: jwtSecret,
  expiresIn: "1d",
};
