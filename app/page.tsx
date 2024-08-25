'use client';
import { useEffect, useState } from 'react';
import Game from './components/Game';
import { useViewport } from '@tma.js/sdk-react';
import SplashScreen from './components/SplashScreen';

export default function Home() {
  const view = useViewport();
  const [loading, setLoading] = useState(true);

  const finishLoading = () => {
    setLoading(false);
  };
  useEffect(() => {
    view?.expand();
  }, [view]);
  return (
    <main className="flex relative min-h-screen flex-col items-center justify-between ">
      {loading ? <SplashScreen finishLoading={finishLoading} /> : null}
      <Game />
    </main>
  );
}
