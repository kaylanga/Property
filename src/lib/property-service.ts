import { query } from './database';
import { motion, AnimatePresence } from 'framer-motion';

export async function fetchProperties() {
  const res = await query('SELECT * FROM properties');
  return res.rows;
}