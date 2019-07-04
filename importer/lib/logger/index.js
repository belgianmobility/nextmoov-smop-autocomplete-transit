
const winston = require('winston');


const { format, transports } = winston;
const { combine, timestamp, printf } = format;
const myFormat = printf(info => `[${info.timestamp}][${info.level}] ${info.message} ${info.durationMs || ''}`);

const logger = winston.createLogger({
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.Console(),
  ],
});

module.exports = logger;
