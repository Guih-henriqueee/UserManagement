import { pool } from '../../../../db/db-connection';
import { Usuario } from '../../../schema/interfaces';

async function getUsuario( ) {
  const keys = ['cpf', 'id' ];
  const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
  const values = ['12345678900', 'some-uuid-value']
  
  const query = `
    SELECT * FROM staging.usuarios 
    WHERE (${keys.join(', ')}) = (${placeholders});
  `;

  try {    
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

export { getUsuario };
