import type { Request, Response } from 'express';

import { db } from '../db/connection.ts';
import { users, type NewUser } from '../db/schema.ts';
import { hashPassword } from '../utils/password.ts';
import { generateToken } from '../utils/jwt.ts';
import { eq } from 'drizzle-orm';
import { compare } from 'bcrypt';

export const register = async (req: Request<any, any, NewUser>, res: Response) => {
  try {
    const hashedPassword = await hashPassword(req.body.password);
    const [user] = await db
      .insert(users)
      .values({
        ...req.body,
        password: hashedPassword,
      })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        createdAt: users.createdAt,
        firstName: users.firstName,
        lastName: users.lastName,
      });
    const token = await generateToken({
      email: user.email,
      username: user.username,
      userId: user.id,
    });
    res.status(201).json({
      message: 'User Created',
      user,
      token,
    });
  } catch (error: unknown) {
    console.error('Registration error: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = await generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    return res.status(200).json({
      message: 'Login success',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    });
  } catch (error: unknown) {
    console.error('Login error: ', error);
    res.status(500).json({ error: 'Failed to Login' });
  }
};
