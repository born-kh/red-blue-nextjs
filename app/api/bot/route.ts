export const dynamic = 'force-dynamic';

export const fetchCache = 'force-no-store';

import dbConnect from '@/app/lib/db';
import FriendModel from '@/app/model/friendModel';
import { Bot, webhookCallback } from 'grammy';

const token = process.env.TG_TOKEN;

if (!token) throw new Error('TELEGRAM_BOT_TOKEN environment variable not found.');

const bot = new Bot(token);
bot.command('start', async (ctx) => {
	console.log(JSON.stringify(ctx.message));
	console.log(JSON.stringify(ctx.chat));
	await dbConnect();
	await FriendModel.create({
		username: ctx.chat.username,
		first_name: ctx.chat.first_name,
		last_name: ctx.chat.last_name,
	});
	console.log(JSON.stringify(ctx.message));
	ctx.reply(JSON.stringify(ctx.message?.text));
});
bot.on('message:text', async (ctx) => {
	await ctx.reply(ctx.message.text);
});

export const POST = webhookCallback(bot, 'std/http');
