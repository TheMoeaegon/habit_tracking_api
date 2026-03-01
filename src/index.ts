import env from '../env.ts';
import app from './server.ts';

app.listen(env.PORT, () => {
  console.log('server listening on port 3000');
});
