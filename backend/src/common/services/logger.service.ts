import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as path from 'path';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor() {
    this.initializeLogger();
  }

  private initializeLogger() {
    const logDir = process.env.LOG_DIR || 'logs';
    const logLevel = process.env.LOG_LEVEL || 'info';

    // Create logs directory if it doesn't exist
    const fs = require('fs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Define log format
    const logFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return JSON.stringify({
          time: timestamp,
          level,
          message,
          ...meta,
        });
      })
    );

    // Create transports
    const transports: winston.transport[] = [
      // Console transport
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
    ];

    // File transports for different log levels
    const logLevels = ['error', 'warn', 'info', 'debug'];
    logLevels.forEach((level) => {
      transports.push(
        new DailyRotateFile({
          filename: path.join(logDir, `${level}-%DATE%.log`),
          datePattern: 'YYYY-MM-DD',
          level,
          maxSize: '20m',
          maxFiles: '14d',
          format: logFormat,
        })
      );
    });

    // Combined log file
    transports.push(
      new DailyRotateFile({
        filename: path.join(logDir, 'combined-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d',
        format: logFormat,
      })
    );

    this.logger = winston.createLogger({
      level: logLevel,
      format: logFormat,
      transports,
      exitOnError: false,
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  // Additional methods for structured logging
  logWithMetadata(message: string, metadata: any, context?: string) {
    this.logger.info(message, { ...metadata, context });
  }

  logErrorWithMetadata(message: string, error: Error, metadata?: any, context?: string) {
    this.logger.error(message, {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      ...metadata,
      context,
    });
  }

  // Method to get logger instance for advanced usage
  getLogger(): winston.Logger {
    return this.logger;
  }
}
