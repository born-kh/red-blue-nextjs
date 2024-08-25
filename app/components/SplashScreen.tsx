import React, { useEffect, useState } from 'react';
import anime from 'animejs';
import Friends from '../icons/Friends';

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
    <div className="flex h-screen items-center justify-center bg-[#43433b] text-white">
      <Friends />
    </div>
  );
};

export default SplashScreen;
