import fastify from 'fastify';
import { FastifyRequest, FastifyReply } from 'fastify';
import { pool } from '../../db/db-connection';

export async function CheckUserSign({ username, password }: { username: string; password: string }) {
  const query = `
    SELECT EXISTS (
      SELECT 1 
      FROM staging.users 
      WHERE username = $1 
        AND password_hash = $2 
        
    ) AS "check";
  `;

  const values = [username, password];

  try {
    const result = await pool.query(query, values);
    // result.rows[0].check será true ou false (boolean)
    console.log('Resultado da verificação:', result.rows[0].check);
    return result.rows[0].check === true;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}
