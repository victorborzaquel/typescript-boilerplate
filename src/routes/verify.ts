import {Request, Response} from 'express';

export function verify(req: Request, res: Response) {
  res.send('Rota principal');
}
