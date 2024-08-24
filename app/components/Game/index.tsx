'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import './game.css';

import useSound from 'use-sound';
import { useInitData, usePopup } from '@tma.js/sdk-react';
import Settings from '@/app/icons/Settings';
import Hamster from '@/app/icons/Hamster';
import Referals from '../Referals';
import CurrencyRub from '@/app/icons/CurrencyRub';

type Button = [string, string];

const buttons: Button[] = [
  ['red', 'Red'],
  ['green', 'Green'],
  ['blue', 'Blue'],
  ['yellow', 'Yellow'],
];
const colorNames: any = {
  Red: 'Красный',
  Green: 'Зеленый',
  Blue: 'Синий',
  Yellow: 'Желтый',
};

function generateButtons(size: number): Button[] {
  const rand16: number[] = [];
  const generated: number[] = [];
  const list: Button[] = Array(16).fill(['grey', '']);

  for (let i = 1; i <= size; i++) {
    const rand = random4(generated);
    generated.push(rand);
    let btn: Button = buttons[rand];

    if (i > 1) {
      const wrong = random3(rand);
      btn = [btn[0], buttons[wrong][1]];
    }

    const pos = random16(rand16);
    rand16.push(pos);
    list[pos] = [btn[0], btn[1]];
  }

  return list;
}

function random16(generated: number[]): number {
  while (true) {
    const rnd = Math.floor(Math.random() * 16);
    if (!generated.includes(rnd)) {
      return rnd;
    }
  }
}

function random4(generated: number[]): number {
  while (true) {
    const rnd = Math.floor(Math.random() * 4);
    if (generated.length >= 4 || !generated.includes(rnd)) {
      return rnd;
    }
  }
}

function random3(ignore: number): number {
  while (true) {
    const rnd = Math.floor(Math.random() * 4);
    if (ignore !== rnd) {
      return rnd;
    }
  }
}

function Game() {
  const [buttons, setButtons] = useState<Button[]>([]);
  const userData = useInitData();
  const popup = usePopup();
  const increment = useRef(0);
  const showCountButtons = useRef(4);
  const [showButtons, setShowButtons] = useState(true);
  const [effect, setEffect] = useState(false);
  const progressInterval = useRef<any>();
  const [score, setScore] = useState(0);
  const [playClick] = useSound('/click.mp3');
  const [playGame] = useSound('/game_process.mp3', { volume: 0.25, loop: true });
  const [playSuccess] = useSound('/success.mp3');
  const [playWrong] = useSound('/wrong.mp3');
  const [gameStart, setGameStart] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setButtons(generateButtons(showCountButtons.current));
    const score = Number(localStorage.getItem('score') || '0');
    setScore(score);
    if (score >= 100) {
      setShowResult(true);
    }
    playGame();
  }, [showCountButtons, playGame]);

  const handleCellClick = useCallback(
    (color: Button) => {
      setGameStart(true);
      increment.current += 1;
      setProgress(100);
      clearInterval(progressInterval.current);
      progressInterval.current = setInterval(() => {
        setProgress((prev) => prev - 5);
      }, 350);

      playClick();

      if (increment.current % 7 === 0) {
        showCountButtons.current += 1;
      }
      setShowButtons(false);
      if (color[0].toLowerCase() === color[1].toLowerCase()) {
        playSuccess();
        setScore((prev) => {
          const score = prev + 0.1;
          localStorage.setItem('score', score.toString());
          return score;
        });
      } else {
        playWrong();
        setScore((prev) => {
          const score = prev > 0.5 ? prev - 0.5 : 0;
          localStorage.setItem('score', score.toString());
          return score;
        });
      }
      setButtons(generateButtons(showCountButtons.current));
      setTimeout(() => {
        setShowButtons(true);
      }, 500);
    },

    [showCountButtons, score]
  );
  useEffect(() => {
    if (score >= 1 && !showResult) {
      clearInterval(progressInterval.current);
      popup
        .open({
          title: '',
          message: 'Вы заработали 10 руб. Хотите выводить?',
          buttons: [
            { id: 'later', type: 'default', text: 'Позже' },
            { id: 'later', type: 'default', text: 'Да' },
          ],
        })
        .finally(() => {
          setShowResult(true);
        });
    }
  }, [score, showResult]);
  useEffect(() => {
    if (progress <= 0) {
      setProgress(100);
      clearInterval(progressInterval.current);
      setScore((prev) => {
        const score = prev > 0.5 ? prev - 0.5 : 0;
        localStorage.setItem('score', score.toString());
        return score;
      });
    }
  }, [progress]);

  return (
    <div className="bg-black flex justify-center w-full">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
        <div className="px-4 z-10">
          <div className="flex items-center space-x-2 pt-4">
            <div className="p-1 rounded-lg bg-[#1d2025]">
              <Hamster size={24} className="text-[#d4d4d4]" />
            </div>
            <div>
              <p className="text-sm">{`${userData?.user?.firstName} ${userData?.user?.lastName}`}</p>
            </div>
          </div>
          <div className="flex items-center justify-between space-x-4 mt-1">
            <div className="flex items-center w-1/3"></div>
            <div className="flex items-center w-2/3 border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-w-64">
              <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
              <div className="flex-1 text-center">
                <p className="text-xs text-[#85827d] font-medium"></p>
                <div className="flex items-center justify-center space-x-1">
                  <p className="text-sm">{score.toFixed(1)}</p>
                  <CurrencyRub size={20} />
                </div>
              </div>

              {showResult && (
                <>
                  {' '}
                  <div className="h-[32px] w-[2px] bg-[#43433b] mx-2">
                    <Settings className="text-white" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
          <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
            <div className="px-4 mt-6 flex justify-between gap-2"></div>
            {showResult ? (
              <Referals />
            ) : (
              <div className="flex flex-1 flex-col items-center relative justify-center w-full">
                <div className=" flex flex-col gap-y-2 items-center top-1 w-full px-2">
                  {gameStart ? (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4">
                      <div
                        className="bg-green-600 h-2.5 rounded-full "
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  ) : (
                    <p className="text-sm mt-4">
                      Кликать на ту ячейку, у которой текст и цвет совпадают.
                    </p>
                  )}
                </div>

                {showButtons && (
                  <div className="game-container animate-fadeIn transition ease-in-out delay-150">
                    {buttons.map((button, index) => {
                      let img = `/${button[0]}.png`;
                      return (
                        <div
                          style={{ backgroundImage: `url(${img})` }}
                          key={index}
                          onClick={() => {
                            if (button[0] !== 'grey') {
                              handleCellClick(button);
                              setEffect(true);
                            }
                          }}
                          className={`${effect && 'animate-wiggle'} grid-item`}
                          onAnimationEnd={() => setEffect(false)}
                        >
                          {colorNames[button[1] as any]}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
