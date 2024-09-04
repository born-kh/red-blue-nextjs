'use client';
import { useEffect, useState } from 'react';
import Game from './components/Game';
import { useInitData, useViewport } from '@tma.js/sdk-react';
import SplashScreen from './components/SplashScreen';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [activated, setActivated] = useState(false);

  const getData = async () => {
    const response = await fetch(`/api/user`, {
      method: 'POST',
      body: JSON.stringify({ code: 111, app_user_id: '1111' }),
    });
    return response.json();
  };

  const finishLoading = () => {
    getData()
      .then((data) => {
        setActivated(!!data?.user?.active);
      })
      .catch(() => {
        setActivated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  // useEffect(() => {
  //   view?.expand();
  // }, [view]);
  return loading ? (
    <SplashScreen finishLoading={finishLoading} />
  ) : (
    <main className="flex relative min-h-screen flex-col items-center justify-between ">
      {/* <Game activated={activated} /> */}
    </main>
  );
}
