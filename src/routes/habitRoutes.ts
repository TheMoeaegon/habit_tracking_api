import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({ messge: 'habits' });
});

router.post('/:id', (req, res) => {
  res.status(200).json({ messge: 'got one habit' });
});

router.post('/', (req, res) => {
  res.status(201).json({ messge: 'create habit' });
});

router.delete('/:id', (req, res) => {
  res.status(200).json({ messge: 'delete habit' });
});

router.post('/:id/complete', (req, res) => {
  res.status(201).json({ messge: 'completed habit' });
});

export default router;
