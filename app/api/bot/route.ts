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

  if (!findUser) {
    if (message) {
      if (message.text.includes('friend')) {
        const id = message.text.split('=')[1];

        const data: any = {
          username: ctx.chat.username,
          first_name: ctx.chat.first_name,
          last_name: ctx.chat.last_name,
          user_id: ctx.chat.id,
          active: false,
        };

        if (message?.text?.includes('fromApp')) {
          data.app_parent_id = id;
        } else {
          data.parent_id = id;
        }
        const user = await UserModel.create(data);
        user.save();
      } else if (message.text.includes('app_user_id')) {
        const id = message.text.split('=')[1];
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

bot.on('message:text', async (ctx) => {
  await ctx.reply(ctx.message.text);
});

export const POST = webhookCallback(bot, 'std/http');
