import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

const SESSION_COOKIE = 'clearpane_session';

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return false;
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return false;
  cookies().set(SESSION_COOKIE, user.id, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' });
  return true;
}

export async function logout() {
  cookies().delete(SESSION_COOKIE);
}

export async function requireAuth() {
  const id = cookies().get(SESSION_COOKIE)?.value;
  if (!id) redirect('/login');
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) redirect('/login');
  return user;
}
