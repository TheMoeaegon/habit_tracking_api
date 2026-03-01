import express from 'express';

const app = express();

app.get('/health', (req, res) => {
  // res.json({ message: 'Hello', secretMessage: 'helo' }).status(200);
  res.send('<button>click me</button>');
});

export { app };
export default app;
