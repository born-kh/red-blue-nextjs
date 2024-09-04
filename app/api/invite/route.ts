// app/api/route.js 👈🏽

import { NextResponse } from 'next/server';

export async function GET(request: any) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);

  const app_user_id = searchParams.get('app_id');

  return NextResponse.json(
    {
      link: `https://t.me/share/url?url=https://t.me/red_blue_game_bot/start=friend=${app_user_id}=fromApp`,
    },
    { status: 200 }
  );
}

export async function POST(request: any) {
  const data = await request.json();
  const { app_user_id } = data;

  return NextResponse.json(
    {
      link: `https://t.me/share/url?url=https://t.me/red_blue_game_bot/start=friend=${app_user_id}=fromApp`,
    },
    { status: 200 }
  );
}
