import app from './app';
import prisma from './config/prismaClient';

const start = (port: number) => {
  try {
    app(prisma).listen(port, () => {
      console.log(`Api running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

start(3000);
