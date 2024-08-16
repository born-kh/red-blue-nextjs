// app/api/route.js 👈🏽

import dbConnect from '@/app/lib/db';

import UserModel from '@/app/model/userModel';
import { NextResponse } from 'next/server';

// To handle a GET request to /api
export async function GET(request: any, { params }: { params: { id: string } }) {
	// Do whatever you want
	await dbConnect();

	const friends = await UserModel.find({ parent_id: params.id });

	return NextResponse.json({ friends }, { status: 200 });
}

// To handle a POST request to /api
export async function POST(request: any) {
	// Do whatever you want
	return NextResponse.json({ message: 'Hello World' }, { status: 200 });
}
