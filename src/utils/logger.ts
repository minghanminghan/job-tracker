import { pino, type Logger } from 'pino'

const PINO_LOG_LEVEL = process.env.NODE_ENv === 'development' ? 'debug' : 'info'

export const logger: Logger = pino({
  // transport: {
  //   target: 'pino-pretty',
  //   options: {
  //     colorize: true,
  //     translateTime: 'SYS:HH:MM:ss.l',
  //     ignore: 'pid,hostname',
  //   },
  // },
  level: PINO_LOG_LEVEL,
  redact: []
})

