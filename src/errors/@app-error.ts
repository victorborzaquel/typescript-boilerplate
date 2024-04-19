export class AppError extends Error {
  status: number;
  data: object;
  constructor(message: string) {
    super(message);
  }
}
