export const dynamic = 'force-dynamic';

export const fetchCache = 'force-no-store';

import { Bot, webhookCallback } from 'grammy';

const token = '7230237367:AAH2M_wy-tBR-T-I0_n_s6YFhm3kWtRODro';

if (!token) throw new Error('TELEGRAM_BOT_TOKEN environment variable not found.');

const bot = new Bot(token);
bot.command('start', (ctx) => {
  ctx.reply('Shodiyor echki!');
});
bot.on('message:text', async (ctx) => {
  await ctx.reply(ctx.message.text);
});

export const POST = webhookCallback(bot, 'std/http');
