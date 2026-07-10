import AuthenticateUserService from "../services/AuthenticateUserService.js";

class SessionController {
  async create(req, res) {
    const result = await AuthenticateUserService.execute(req.body);
    return res.json(result);
  }
}

export default new SessionController();
