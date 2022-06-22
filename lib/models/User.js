const pool = require('../utils/pool');
const jwt = require('jsonwebtoken');

module.exports = class User {
  id;
  email;
  #passwordHash;

  constructor({ id, email, password_hash }) {
    this.id = id;
    this.email = email;
    this.#passwordHash = password_hash;
  }

  get passwordHash() {
    return this.#passwordHash;
  }

  static async signIn(email){
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if(!rows[0]){
      throw new Error('User not found');
    }

    return new User(rows[0]);
  }

  static async signUp(email, passwordHash){

    if(!email.includes('@defense.gov')){
      throw new Error('Only @defense.gov email addresses are allowed');
    }
    
    const { rows } = await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *', [email, passwordHash]);
    return new User(rows[0]);
  }
    
  static authToken() {
    return jwt.sign({ ...this }, process.env.JWT_SECRET, { expiresIn: '1 day' });
  }
};
