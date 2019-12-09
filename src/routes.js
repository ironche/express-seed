import { Router } from 'express';

export default function () {
  return Router()
    .get('/', (req, res) => res.json({
      status: 'Hello world!',
    }));
}
