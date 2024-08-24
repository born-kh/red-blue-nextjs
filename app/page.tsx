'use client';
import { useEffect, useState } from 'react';
import Game from './components/Game';
import { useTelegram } from './lib/TelegramProvider';

export default function Home() {
  const { webApp } = useTelegram();
  useEffect(() => {
    webApp?.expand();
  }, [webApp]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between m-8">
      <Game />
    </main>
  );
}
