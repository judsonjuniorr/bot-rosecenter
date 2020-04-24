import Winston from 'winston';
import path from 'path';

interface ItemRequest {
  request: string;
  query: string;
}

class Logger {
  private logger: Winston.Logger;

  private readonly fileOpts = {
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  };

  private readonly config = {
    transports: [
      new Winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
      }),
      new Winston.transports.File({
        level: 'info',
        filename: path.resolve(__dirname, '..', '..', 'logs', 'info.log'),
        ...this.fileOpts,
      }),
      new Winston.transports.File({
        level: 'warn',
        filename: path.resolve(__dirname, '..', '..', 'logs', 'warnings.log'),
        ...this.fileOpts,
      }),
      new Winston.transports.File({
        level: 'error',
        filename: path.resolve(__dirname, '..', '..', 'logs', 'errors.log'),
        ...this.fileOpts,
      }),
    ],
  };

  constructor() {
    const {
      combine,
      timestamp: timestampp,
      label: labell,
      printf,
    } = Winston.format;

    const myFormat = printf(({ level, message, label, timestamp }) => {
      return `${timestamp} [${label}] ${level}: ${message}`;
    });

    this.logger = Winston.createLogger({
      format: combine(labell(), timestampp(), myFormat),
      ...this.config,
    });
  }

  log(): Winston.Logger {
    return this.logger;
  }

  private createLogger(
    label: string,
    request: string,
    query: string,
  ): Winston.Logger {
    const {
      combine,
      timestamp: timestampp,
      label: labell,
      printf,
    } = Winston.format;

    const format = printf(({ level, message, label: labelF, timestamp }) => {
      return `${timestamp} [${labelF}] ${level}: User: ${request} | Query: ${query} | ${message}`;
    });

    return Winston.createLogger({
      format: combine(labell({ label }), timestampp(), format),
      ...this.config,
    });
  }

  item({ request, query }: ItemRequest): Winston.Logger {
    return this.createLogger('ITEM', request, query);
  }

  mob({ request, query }: ItemRequest): Winston.Logger {
    return this.createLogger('MOB', request, query);
  }
}

export default new Logger();
