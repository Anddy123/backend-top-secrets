const bcrypt = require('bcryptjs/dist/bcrypt');
const User = require('../models/User');

module.exports = class UserService {

  static async hash({ email, password }) {
    const passwordHash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
    const user = await User.signUp(email, passwordHash);
    return user;
  }

  static async signIn({ email, password }) {
    const user = await User.signIn(email);
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if(!user) throw new Error('Invalid email');
    if (!isValid) {
      throw new Error('Invalid password / email');
    }
    return user;
  }
};
