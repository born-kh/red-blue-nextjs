// app/api/route.js 👈🏽

import dbConnect from '@/app/lib/db';
import UserModel from '@/app/model/userModel';
import { NextResponse } from 'next/server';

export async function GET(request: any) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const user_id = searchParams.get('id');
  const app_user_id = searchParams.get('app_id');
  await dbConnect();

  let user;
  if (user_id) {
    user = await UserModel.findOne({ user_id: user_id });
  } else if (app_user_id) {
    user = await UserModel.findOne({ app_user_id: app_user_id });
  }

  if (!user) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json({ user }, { status: 200 });
}

export async function POST(request: any) {
  const data = await request.json();
  const { code, app_user_id } = data;
  await dbConnect();
  const findUser = await UserModel.findOne({ user_id: code });
  if (!findUser) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  findUser.active = true;
  findUser.app_user_id = app_user_id;
  findUser.save();
  const parentUser = await UserModel.findOne({ user_id: findUser?.parent_id });

  return NextResponse.json({ parentId: parentUser?.app_user_id }, { status: 200 });
}
