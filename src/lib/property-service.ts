import { query } from './database';

export async function fetchProperties() {
  const res = await query('SELECT * FROM properties');
  return res.rows;
}