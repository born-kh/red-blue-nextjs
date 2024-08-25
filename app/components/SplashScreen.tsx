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
      <img id="logo" src="/logo.png" alt="Logo" className="w-20 h-20" />
    </div>
  );
};

export default SplashScreen;
