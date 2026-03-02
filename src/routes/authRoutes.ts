import { Router } from 'express';

const router = Router();

router.post('/register', (req, res) => {
  res.status(201).json({ messge: 'user signed up' });
});

router.post('/login', (req, res) => {
  res.status(200).json({ messge: 'user logged in' });
});

export default router;
