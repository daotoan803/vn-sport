const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const Account = require('../models/account.model');
const bcrypt = require('bcrypt');

const TOKEN_KEY = process.env.TOKEN_KEY;

const generateAuthorizationFunction = (role) => {
  return async (req, res, next) => {
    const userAccount = req.userAccount;
    if (userAccount.role !== role) return res.sendStatus(403);

    next();
  };
};

module.exports = {
  async signin(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        error: "Email and password can't be empty",
      });

    try {
      const user = await User.validateLoginAndGetUser(email, password);
      if (!user)
        return res.status(400).json({ error: 'invalid email or password' });

      req.user = user;
      next();
    } catch (e) {
      next(e);
    }
  },

  async validateAccessToken(req, res, next) {
    try {
      const authorization = req.headers?.authorization;
      const token = authorization?.split(/^(Bearer )/i)[2];
      if (!token) return res.sendStatus(401);
      const { userId, userKey } = jwt.verify(token, TOKEN_KEY);
      const userAccount = await Account.findOne({
        where: { userId },
      });
      if (!userAccount || userKey !== userAccount.userKey)
        return res.sendStatus(401);
      req.userAccount = userAccount;
      next();
    } catch (e) {
      next(e);
    }
  },

  async logoutEveryWhere(req, res) {
    const userAccount = req.userAccount;
    const { password } = req.body;

    if (!password?.trim())
      return res.status(400).json({ error: 'password is required' });

    const isAuthorized = await bcrypt.compare(password, userAccount.password);
    if (!isAuthorized) return res.status(400).json({ error: 'wrong password' });

    userAccount.userKey = Account.generateUserKey();
    await userAccount.save();
    res.sendStatus(200);
  },
  checkAdminAuthorization: generateAuthorizationFunction(Account.role.admin),
};
