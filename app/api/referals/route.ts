// app/api/route.js 👈🏽

import dbConnect from '@/app/lib/db';

import UserModel from '@/app/model/userModel';
import { NextResponse } from 'next/server';

export async function GET(request: any) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const id = searchParams.get('id');
  await dbConnect();
  const friends = await UserModel.find({ parent_id: id });
  return NextResponse.json({ friends }, { status: 200 });
}

export async function POST(request: any) {
  const data = await request.json();
  const { code_id } = data;
  await dbConnect();
  const findUser = await UserModel.findOne({ user_id: code_id });
  if (!findUser) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  findUser.active = true;
  findUser.save();
  return NextResponse.json({ message: 'Ok' }, { status: 200 });
}
