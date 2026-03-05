import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.ts';

const router = Router();

router.use(authenticateToken);

router.get('/', (req, res) => {
  res.status(200).json({ messge: 'users' });
});

router.post('/:id', (req, res) => {
  res.status(200).json({ messge: 'got one user' });
});

router.put('/:id', (req, res) => {
  res.status(200).json({ messge: 'update user' });
});

router.delete('/:id', (req, res) => {
  res.status(200).json({ messge: 'delete user' });
});

export default router;
