import UserCreateService from "../services/UserCreateService.js";
import UserPasswordResetService from "../services/UserPasswordResetService.js";

class UserController {
  async create(req, res) {
    const user = await UserCreateService.execute(req.body);
    return res.status(201).json(user);
  }

  async resetPassword(req, res) {
    const result = await UserPasswordResetService.execute(req.body);
    return res.json(result);
  }
}

export default new UserController();
