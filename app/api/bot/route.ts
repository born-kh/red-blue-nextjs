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
  console.log('match', ctx.match);
  const findUser = await UserModel.findOne({ user_id: ctx.chat.id });

  console.log('findUser', message, ctx);
  if (!findUser) {
    console.log('message', message);
    if (message) {
      if (message.text.includes('friend')) {
        const id = message.text.split('=')[1];
        console.log('friend', id);
        const data: any = {
          username: ctx.chat.username,
          first_name: ctx.chat.first_name,
          last_name: ctx.chat.last_name,
          user_id: ctx.chat.id,
          active: false,
        };

        if (message?.text?.includes('fromApp')) {
          data.parent_id = id;
        } else {
          data.app_parent_id = id;
        }
        const user = await UserModel.create(data);
        user.save();
      } else if (message.text.includes('app_user_id')) {
        const id = message.text.split('=')[1];
        console.log('app_user_id', id);
        const user = await UserModel.create({
          app_user_id: id,
          username: ctx.chat.username,
          first_name: ctx.chat.first_name,
          last_name: ctx.chat.last_name,
          user_id: ctx.chat.id,
          active: true,
        });
        user.save();
      }
    }
  }

  ctx.reply(JSON.stringify(ctx.message?.text));
});

bot.command('add', async (ctx) => {
  // `item` will be "apple pie" if a user sends "/add apple pie".
  const item = ctx.match;
  console.log('addd', ctx);
});
bot.on('message:text', async (ctx) => {
  await ctx.reply(ctx.message.text);
});

export const POST = webhookCallback(bot, 'std/http');
