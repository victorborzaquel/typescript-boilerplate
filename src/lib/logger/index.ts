import {
  createLogger,
  format,
  transports,
  Logger as WinstonLogger,
} from 'winston';
import {env} from '../env';

export class Logger {
  private readonly logger: WinstonLogger;
  readonly levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  };

  constructor(readonly label?: string) {
    this.logger = createLogger({
      format: format.combine(
        format.timestamp({format: 'DD/MM/YYYY HH:mm:ss'}),
        format.errors({stack: true}),
        format.splat(),
        format.json()
      ),
      transports: [
        new transports.File({
          filename: 'logs/combined.log',
          level: 'info',
        }),
        new transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
      ],
    });

    if (env.isDevelopment) {
      this.logger.add(new transports.Console());
    }

    if (label) {
      this.logger.unshift(format.label({label}));
    }
  }
  error(message: string) {
    this.logger.error(message);
  }
  warn(message: string) {
    this.logger.warn(message);
  }
  info(message: string) {
    this.logger.info(message);
  }
  http(message: string) {
    this.logger.http(message);
  }
  verbose(message: string) {
    this.logger.verbose(message);
  }
  debug(message: string) {
    this.logger.debug(message);
  }
  silly(message: string) {
    this.logger.silly(message);
  }

  fromError(error: unknown) {
    if (error instanceof Error) {
      const format = {name: error.name, stack: error.stack};
      this.logger.error(error.message, format);
      if (env.isDevelopment) {
        console.error(`message: ${error.message}`);
        console.error(`name: ${error.name}`);
        console.error(error.stack);
      }
    } else {
      this.logger.error(JSON.stringify(error));
      if (env.isDevelopment) {
        console.error(JSON.stringify(error));
      }
    }
  }
}
