import type { Request, Response } from 'express';

import { db } from '../db/connection.ts';
import { users, type NewUser } from '../db/schema.ts';
import { hashPassword } from '../utils/password.ts';

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
    res.status(201).json({
      message: 'User Created',
      user,
    });
  } catch (error: unknown) {
    console.error('Registration error: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
