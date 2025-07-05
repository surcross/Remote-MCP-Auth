import express from 'express';

import { PORT } from './constants';
import { router } from './router';

const app = express();

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
