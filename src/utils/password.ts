import bcrypt from 'bcrypt';
import env from '../../env.ts';

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, env.BCRYPT_ROUNDS);
};
