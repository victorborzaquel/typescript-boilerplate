/**
 * Error thrown when a response has a status code that is not in the 200 range.
 */
export class ResponseError extends Error {
  status: number;
  data?: unknown;

  constructor(input: {status: number; message: string; data?: unknown}) {
    super(input.message);
    this.status = input.status;
    this.data = input.data;
    this.name = 'HttpResponseError';
    Object.setPrototypeOf(this, ResponseError.prototype);
  }
}
