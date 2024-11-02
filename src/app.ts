import express, { Application } from 'express';
import bodyParser from 'body-parser';
import corsMiddleware from './middlewares/cors';
import userRoutes from './routes/user.routes';
import { setupSwagger } from './config/swagger';
import paymentRouter from './routes/payment.routes';
import accRouter from './routes/account.routes';
import transRouter from './routes/transaction.routes';
import coinRouter from './routes/coin.routes';
import fileRouter from './routes/file.routes';
import path from 'path';
import cron from 'node-cron';
import Payment from './models/user/payment.model';
import chainRouter from './routes/chain.routes';
import authRoutes from './routes/auth.routes';
import Transaction from './models/user/transaction.model';
import AiEarning from './models/user/ai-earning.model';
import aiRouter from './routes/aiEarning.routes';
import dailyRouter from './routes/dailyEarning.routes';
import DailyEarning from './models/user/daily-earning.model';

const app: Application = express();

// Middleware
app.use(bodyParser.json());
app.use(corsMiddleware);

// Routes
app.use('/auth', authRoutes);
app.use('/api', userRoutes, authRoutes, paymentRouter, accRouter, transRouter, coinRouter, fileRouter, chainRouter, aiRouter, dailyRouter);
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Swagger Docs
setupSwagger(app);

// Health check route
app.get('/', (req, res) => {
  res.send('API is running');
});

app.put('/api/ai-earnings', async (req, res) => {
  try {
    await updateAIEarningsForAllUsers();
    res.status(200).json({ message: 'Daily earnings updated successfully' });
  } catch (error) {
    console.error('Error updating daily earnings:', error);
    res.status(500).json({ message: 'Error updating daily earnings' });
  }
});

app.put('/api/daily-earnings', async (req, res) => {
  try {
    await updateDailyEarningsForAllUsers();
    res.status(200).json({ message: 'Daily earnings updated successfully' });
  } catch (error) {
    console.error('Error updating daily earnings:', error);
    res.status(500).json({ message: 'Error updating daily earnings' });
  }
});

async function updateAIEarningsForAllUsers() {
  try {
    // Fetch all users from the Payment table
    const existingUsers = await Payment.findAll();

    for (const user of existingUsers) {
      // Check if the user has a commission value
      const commission = parseFloat(user.commission);
      if (commission) {
        console.log(commission)
        console.log((user.selfInvestment * commission) / 100)
        // Calculate the new earnings value
        const newEarnings = parseFloat(user.earnWallet.toString()) + (user.selfInvestment * commission) / 100;
        const aiEarnings = parseFloat(user.aiEarning.toString()) + (user.selfInvestment * commission) / 100;

        // Update the earnWallet field for each user
        await Payment.update(
          {
            earnWallet: newEarnings,
            aiEarning: aiEarnings
          },
          { where: { payId: user.payId } }
        );
        console.log({
          userId: user.userId,
          userName: user.userName,
          aiEarning: aiEarnings,
          status: 'paid'
        })
        await AiEarning.create(
          {
            userId: user.userId,
            userName: user.userName,
            aiEarning: (user.selfInvestment * commission) / 100,
            status: 'paid'
          }
        );

        console.log(`Updated earnings for userId ${user.payId} to ${newEarnings}`);
      }
    }
  } catch (error) {
    console.error('Error updating daily earnings for all users:', error);
  }
}
// Adjusted autoCreateDailyEarnings function
// Assuming Payment is a Sequelize model
async function updateDailyEarningsForAllUsers() {
  try {
    // Fetch all users from the Payment table
    const existingUsers = await Payment.findAll();

    for (const user of existingUsers) {
      // Check if the user has a commission value
      const commission = parseFloat(user.commission);
      if (commission) {
        console.log(commission)
        console.log((user.selfInvestment * commission) / 100)
        // Calculate the new earnings value
        const newEarnings = parseFloat(user.earnWallet.toString()) + (user.selfInvestment * commission) / 100;
        const aiEarnings = parseFloat(user.aiEarning.toString()) + (user.selfInvestment * commission) / 100;

        // Update the earnWallet field for each user
        await Payment.update(
          {
            earnWallet: newEarnings,
            aiEarning: aiEarnings
          },
          { where: { payId: user.payId } }
        );
        console.log({
          userId: user.userId,
          userName: user.userName,
          aiEarning: aiEarnings,
          status: 'paid'
        })
        await DailyEarning.create(
          {
            userId: user.userId,
            userName: user.userName,
            aiEarning: (user.selfInvestment * commission) / 100,
            status: 'paid'
          }
        );

        console.log(`Updated earnings for userId ${user.payId} to ${newEarnings}`);
      }
    }
  } catch (error) {
    console.error('Error updating daily earnings for all users:', error);
  }
}


// Schedule the auto-increment function to run daily at 1 AM
cron.schedule('0 0 * * *', updateAIEarningsForAllUsers);
// Schedule the auto-increment function to run daily at 1 AM
cron.schedule('0 0 * * *', updateDailyEarningsForAllUsers);
// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

export default app;
