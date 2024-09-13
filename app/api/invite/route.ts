// app/api/route.js 👈🏽

import dbConnect from '@/app/lib/db';
import UserModel from '@/app/model/userModel';
import { NextResponse } from 'next/server';

export async function GET(request: any) {
	const url = new URL(request.url);
	const searchParams = new URLSearchParams(url.searchParams);

	const app_user_id = searchParams.get('app_id');

	await dbConnect();
	const user = await UserModel.findOne({ app_user_id: app_user_id });
	if (!user) {
		return NextResponse.json(
			{
				link: `https://t.me/red_blue_game_bot?start=app_user_id=${app_user_id}`,
				referals: [],
			},
			{ status: 200 }
		);
	}
	const referals = await UserModel.find({ parent_id: user.user_id });
	const referalIds = referals.filter((ref) => ref.active).map((ref) => ref.app_user_id);
	return NextResponse.json(
		{
			link: `https://t.me/red_blue_game_bot?start=app_user_id=${app_user_id}`,
			referals: referalIds,
		},
		{ status: 200 }
	);
}

export async function POST(request: any) {
	const data = await request.json();
	const { app_user_id } = data;

	return NextResponse.json(
		{
			link: `https://t.me/red_blue_game_bot?start=app_user_id=${app_user_id}`,
		},
		{ status: 200 }
	);
}
