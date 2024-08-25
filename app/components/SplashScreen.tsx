'use client';
import React, { useEffect } from 'react';
import anime from 'animejs';
import SplashIcon from '../icons/SplashIcon';

const SplashScreen = ({ finishLoading }: any) => {
  useEffect(() => {
    const loader = anime.timeline({
      complete: () => finishLoading(),
    });
    loader.add({
      targets: '#logo',
      delay: 0,
      scale: 3,
      duration: 2000,
      easing: 'easeInOutExpo',
    });
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-[#1d2025] text-white">
      <SplashIcon />
    </div>
  );
};

export default SplashScreen;
