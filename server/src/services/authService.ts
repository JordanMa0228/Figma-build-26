import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const createUser = async (
  email: string,
  name: string,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return prisma.user.create({
    data: { email, name, password: hashedPassword },
  });
};

export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
