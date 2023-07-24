import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import connnectiond from './database/connect';
import app from './app';
connnectiond();
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');

  console.log(err.name, err.message);
  process.exit(1);
});

const port = process.env.PORT || 3000;

const server = app.listen(port, (): void => {
  console.log(`app listening on port ${port}`);
});

process.on(
  'unhandledRejection',
  (err: { name: string; message: string }): void => {
    /* eslint no-console: "off" */
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  }
);
