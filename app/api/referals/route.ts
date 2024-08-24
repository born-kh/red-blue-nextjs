// app/api/route.js 👈🏽

import dbConnect from '@/app/lib/db';

import UserModel from '@/app/model/userModel';
import { NextResponse } from 'next/server';

export async function GET(request: any) {
  const { searchParams } = new URL(request.url);
  const parent_id = searchParams.get('id');
  await dbConnect();

  const friends = await UserModel.find();

  return NextResponse.json({ friends }, { status: 200 });
}

export async function POST(request: any) {
  return NextResponse.json({ message: 'Hello World' }, { status: 200 });
}
