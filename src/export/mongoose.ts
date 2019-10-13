import * as mongoose from 'mongoose';

(mongoose as any).Promise = global.Promise;

mongoose.connection.on('error', (e) => {
  console.log('MongoDB connection error. Please make sure MongoDB is running.');
  console.error(e);

  process.exit(1);
});

export default mongoose;
