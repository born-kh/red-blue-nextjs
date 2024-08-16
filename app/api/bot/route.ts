export const dynamic = 'force-dynamic';

export const fetchCache = 'force-no-store';

import dbConnect from '@/app/lib/db';
import UserModel from '@/app/model/userModel';
import { Bot, webhookCallback } from 'grammy';

const token = process.env.TG_TOKEN;

if (!token) throw new Error('TELEGRAM_BOT_TOKEN environment variable not found.');

const bot = new Bot(token);
bot.command('start', async (ctx) => {
  const message = ctx.message;
  await dbConnect();

  const findUser = await UserModel.findOne({ user_id: ctx.chat.id });

  console.log(findUser);
  if (!findUser) {
    if (message) {
      if (message.text.includes('fren')) {
        const parent_id = message.text.split('=')[1];
        const user = await UserModel.create({
          parent_id,
          username: ctx.chat.username,
          first_name: ctx.chat.first_name,
          last_name: ctx.chat.last_name,
          user_id: ctx.chat.id,
          active: false,
        });
        user.save();
      }
    }
    const user = await UserModel.create({
      username: ctx.chat.username,
      first_name: ctx.chat.first_name,
      last_name: ctx.chat.last_name,
      user_id: ctx.chat.id,
    });
    user.save();
  }

  ctx.reply(JSON.stringify(ctx.message?.text));
});
bot.on('message:text', async (ctx) => {
  await ctx.reply(ctx.message.text);
});

export const POST = webhookCallback(bot, 'std/http');
