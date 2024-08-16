'use client';
import { useEffect, useState } from 'react';
import Game from './components/Game';
import { useInitData } from '@tma.js/sdk-react';

export default function Home() {
	const userData = useInitData();
	const [friends, setFriends] = useState<any[]>([]);
	useEffect(() => {
		const getData = async () => {
			const response = await fetch(`/api/db${userData?.user?.id}`, {
				method: 'GET',
			});
			return response.json();
		};
		getData()
			.then((data) => {
				console.log(data);
				setFriends(data.friends as any);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<Game />
			{friends.map((friend) => {
				return <div>{JSON.stringify(friend)}</div>;
			})}
		</main>
	);
}
