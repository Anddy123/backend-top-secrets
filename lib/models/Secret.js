const pool = require('../utils/pool');

module.exports = class Secret {
  id;
  title;
  description;
  createdAt;

  constructor({ id, title, description, created_at }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.createdAt = created_at;
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM secrets');
    return rows.map(row => new Secret(row));
  }

  static async createSecret({ title, description }) {
    const { rows } = await pool.query('INSERT INTO secrets (title, description) VALUES ($1, $2) RETURNING *', [title, description]);
    return new Secret(rows[0]);
  }
};
