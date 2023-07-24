import mongoose from 'mongoose';

const DB: string | undefined = process.env.DATABASE?.replace(
  '<PASSWORD>',
  typeof process.env?.DATABASE_PASSWORD === 'string'
    ? process.env.DATABASE_PASSWORD
    : ''
);

const connnection = () => {
  try {
    if (typeof DB === 'string') {
      mongoose.connect(DB).then((): void => {
        // eslint-disable-next-line no-console
        console.log('DB connection successful');
      });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`Connection Error  => ${err}`);
    process.exit(1);
  }
};

export default connnection;
