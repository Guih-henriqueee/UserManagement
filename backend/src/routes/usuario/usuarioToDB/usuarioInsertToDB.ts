import { pool } from '../../../../db/db-connection';
import { Usuario } from '../../../schema/interfaces';

async function postUsuario(usuario: Usuario) {
  const keys = Object.keys(usuario);
  const values = Object.values(usuario);
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

  const query = `
    INSERT INTO staging.usuarios (${keys.join(', ')})
    VALUES (${placeholders})
    RETURNING *;
  `;
  try {    
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}
export { postUsuario };
