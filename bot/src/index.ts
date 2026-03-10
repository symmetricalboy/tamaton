import { Telegraf, Markup } from 'telegraf';
import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error('BOT_TOKEN must be provided!');
}

const webAppUrl = process.env.WEBAPP_URL || 'https://google.com'; // Placeholder, should be the Railway frontend URL
const port = process.env.PORT || 3000;

// Initialize Bot
const bot = new Telegraf(token);

bot.command('start', (ctx) => {
  return ctx.reply(
    'Welcome to the TON Pet Game! 🐾\nTap the button below to start collecting coins, earning Stars, and upgrading your pet.',
    Markup.inlineKeyboard([
      Markup.button.webApp('Play Now 🎮', webAppUrl)
    ])
  );
});

bot.launch().then(() => {
  console.log('Bot is successfully running...');
}).catch((err) => {
  console.error('Failed to launch bot:', err);
});

// Initialize Express App for Frontend API
const app = express();
app.use(cors());
app.use(express.json());

// Example API endpoint for the React frontend
app.get('/api/user/:id', (req: Request, res: Response) => {
  // In the future, this will fetch from Prisma
  res.json({
    telegramId: req.params.id,
    coinsBalance: 0,
    starsBalance: 0
  });
});

app.listen(port, () => {
  console.log(`Frontend API Server running on port ${port}`);
});

// Enable graceful stop
process.once('SIGINT', () => { bot.stop('SIGINT'); process.exit(0); });
process.once('SIGTERM', () => { bot.stop('SIGTERM'); process.exit(0); });
