import {z} from 'zod';

export const validStringNumber = () =>
  z.string().transform(value => parseInt(value, 10));

export const validStringBoolean = () =>
  z.enum(['true', 'false']).transform(value => value === 'true');
