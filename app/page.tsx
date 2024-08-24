'use client';
import { useEffect } from 'react';
import Game from './components/Game';
import { useViewport } from '@tma.js/sdk-react';

export default function Home() {
  // const view = useViewport();
  // useEffect(() => {
  //   view?.expand();
  // }, [view]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between m-8">
      <Game />
    </main>
  );
}
