export const dynamic = 'force-dynamic';

export const fetchCache = 'force-no-store';

import { Bot, webhookCallback } from 'grammy';

const token = process.env.TG_TOKEN;

if (!token) throw new Error('TELEGRAM_BOT_TOKEN environment variable not found.');

const bot = new Bot(token);
bot.command('start', (ctx) => {
	ctx.reply('Shodiyor echki!');
});
bot.on('message:text', async (ctx) => {
	await ctx.reply(ctx.message.text);
});

export const POST = webhookCallback(bot, 'std/http');
