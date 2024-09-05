'use client';
import { useEffect, useState } from 'react';
import Game from './components/Game';
import { useInitData, useViewport } from '@tma.js/sdk-react';
import SplashScreen from './components/SplashScreen';

export default function Home() {
  const view = useViewport();
  const [loading, setLoading] = useState(true);
  const [activated, setActivated] = useState(false);
  const [score, setScore] = useState(0);
  const userData = useInitData();
  const getData = async () => {
    const response = await fetch(`/api/user?id=${userData?.user?.id}`, {
      method: 'GET',
    });
    return response.json();
  };

  const finishLoading = () => {
    getData()
      .then((data) => {
        setActivated(!!data?.user?.active);
        setScore(data?.user?.score || 0);
      })
      .catch(() => {
        console.log('error');
        setActivated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    view?.expand();
  }, [view]);
  return loading ? (
    <SplashScreen finishLoading={finishLoading} />
  ) : (
    <main className="flex relative min-h-screen flex-col items-center justify-between ">
      <Game activated={activated} score={score} />
    </main>
  );
}
