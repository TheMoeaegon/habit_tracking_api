import { Router } from 'express';
import { validateBody, validateParams } from '../middlewares/validation.ts';
import { z } from 'zod';
import { authenticateToken } from '../middlewares/auth.ts';

const createHabitSchema = z.object({
  name: z.string(),
});

const completeParamsSchema = z.object({
  id: z.string().max(3),
});

const router = Router();

router.use(authenticateToken);

router.get('/', (req, res) => {
  res.status(200).json({ messge: 'habits' });
});

router.post('/:id', (req, res) => {
  res.status(200).json({ messge: 'got one habit' });
});

router.post('/', validateBody(createHabitSchema), (req, res) => {
  res.status(201).json({ messge: 'create habit' });
});

router.delete('/:id', (req, res) => {
  res.status(200).json({ messge: 'delete habit' });
});

router.post('/:id/complete', validateParams(completeParamsSchema), validateBody(createHabitSchema), (req, res) => {
  res.status(201).json({ messge: 'completed habit' });
});

export default router;
