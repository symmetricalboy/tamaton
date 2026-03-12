# Tamaton - Telegram Mini App

This repository contains the source code for Tamaton, a Telegram Mini App featuring TON and Telegram Stars integration. 
## Project Structure
- `/app` - The React + Vite frontend for the Telegram Mini App.
- `/bot` - The Node.js + Telegraf bot backend.
- `bot/prisma` - The PostgreSQL database schema.

## Local Development

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- Telegram Bot Token

### 1. Database Setup
Ensure you have a local PostgreSQL instance running.
Create a `.env` file in the `/bot` directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/tamaton"
BOT_TOKEN="your_telegram_bot_token"
WEBAPP_URL="http://localhost:5173"
```

In the `/bot` directory, initialize the database:
```bash
cd bot
npm install
npx prisma generate
npx prisma db push
```

### 2. Run the Bot
```bash
npm run dev
```

### 3. Run the Frontend
In a new terminal window:
```bash
cd app
npm install
npm run dev
```

## Deployment on Railway

This repository is configured as a monorepo. You will need to create three resources in your Railway project:

1. **PostgreSQL Database**:
   - Provision a Postgres database from the Railway dashboard.
   - It will automatically generate a `DATABASE_URL`.

2. **Bot Service**:
   - Create a new "GitHub Repo" service pointing to this repository.
   - Go to **Settings > General** and set the **Root Directory** to `/bot`.
   - Add the following Environment Variables:
     - `BOT_TOKEN`: Your Telegram bot token.
     - `DATABASE_URL`: Reference the Postgres database variable.
     - `WEBAPP_URL`: The URL of your deployed frontend.
   - Set the build command: `npm install && npx prisma generate && npm run build`
   - Set the start command: `npm run start`

3. **Frontend Service**:
   - Create another "GitHub Repo" service pointing to this repository.
   - Go to **Settings > General** and set the **Root Directory** to `/app`.
   - Add the following Environment Variable:
     - `VITE_BOT_API_URL`: The URL of your deployed bot service (optional, if your frontend needs to make direct API calls to your bot backend).
   - Ensure the build command is `npm install && npm run build`.
   - Railway will automatically detect it as a static Vite site.

Enjoy building your Tamaton Mini App!
