'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

import './game.css';

import useSound from 'use-sound';
import { useCloudStorage, useInitData, usePopup, useViewport } from '@tma.js/sdk-react';
import Settings from '@/app/icons/Settings';
import Hamster from '@/app/icons/Hamster';
import Referals from '../Referals';

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

function Game({ activated }: { activated: boolean }) {
  const [buttons, setButtons] = useState<Button[]>([]);
  const userData = useInitData();
  const popup = usePopup();

  const showCountButtons = useRef(4);
  const [showButtons, setShowButtons] = useState(true);
  const [effect, setEffect] = useState(false);
  const progressInterval = useRef<any>();
  const [score, setScore] = useState(0);
  const [playClick] = useSound('/click.mp3');
  const [playGame, { stop }] = useSound('/game_process.mp3', { volume: 0.1, loop: true });
  const [playSuccess] = useSound('/success.mp3', { volume: 0.2 });
  const [playWrong] = useSound('/wrong.mp3', { volume: 0.2 });
  const [gameStart, setGameStart] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const storage = useCloudStorage();
  const [progress, setProgress] = useState(100);
  const [isWithdraw, setIsWithdraw] = useState(false);
  useEffect(() => {
    async function checkScore() {
      storage.get('score').then((value) => {
        const score = Number(value || '0');
        showCountButtons.current = 4 + score;
        setButtons(generateButtons(showCountButtons.current));
        setScore(score);
        if (score >= 1) {
          setShowResult(true);
        }
      });
    }
    if (!activated) {
      checkScore();
    } else {
      setShowResult(true);
    }
    playGame();
  }, [showCountButtons, playGame, activated]);

  const handleCellClick = useCallback(
    (color: Button) => {
      setProgress(100);
      clearInterval(progressInterval.current);
      progressInterval.current = setInterval(() => {
        setProgress((prev) => prev - 1);
      }, 70);

      playClick();

      setShowButtons(false);
      if (color[0].toLowerCase() === color[1].toLowerCase()) {
        setGameStart(true);

        if (gameStart) {
          playSuccess();
          setScore((prev) => {
            const score = Number((prev + 0.1).toFixed(1));

            showCountButtons.current = 4 + score;

            storage.set('score', score.toString());
            return score;
          });
        }
      } else {
        if (gameStart) {
          playWrong();
          setScore((prev) => {
            const score = prev > 0.5 ? prev - 0.5 : 0;
            storage.set('score', score.toString());
            return score;
          });
        }
      }
      setButtons(generateButtons(showCountButtons.current));
      setTimeout(() => {
        setShowButtons(true);
      }, 500);
    },

    [showCountButtons, score, gameStart, playClick, playSuccess, playWrong]
  );
  const view = useViewport();

  useEffect(() => {
    const listener = (isExpanded: boolean) => {
      if (isExpanded) {
        clearInterval(progressInterval.current);
        stop();
      } else {
        playGame();
      }
    };
    view?.on('change:isExpanded', listener);
    view?.off('change:isExpanded', listener);
  }, []);
  useEffect(() => {
    if (score >= 1 && gameStart) {
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
  }, [score, gameStart]);
  useEffect(() => {
    if (progress <= 0 && gameStart) {
      playWrong();
      clearInterval(progressInterval.current);
      setScore((prev) => {
        const score = prev > 0.5 ? prev - 0.5 : 0;
        storage.set('score', score.toString());
        return score;
      });
      setButtons(generateButtons(showCountButtons.current));
      setTimeout(() => {
        setShowButtons(true);
      }, 500);
    }
  }, [progress, gameStart, playSuccess]);

  return (
    <div className="bg-black flex justify-center w-full">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
        <div className="px-4 z-10 justify">
          <div className="flex items-center pt-4 justify-between">
            <div className="flex items-center space-x-2 ">
              <div className="p-1 rounded-lg bg-[#1d2025]">
                <Hamster size={24} className="text-[#d4d4d4]" />
              </div>
              <div>
                <p className="text-sm">{`${userData?.user?.firstName} ${
                  userData?.user?.lastName || ''
                }`}</p>
              </div>
            </div>
            {/* <div className="flex items-center gap-1">
              {showResult && !activated && (
                <>
                  <p className="text-sm">Ваш код: {userData?.user?.id}</p>
                  <div
                    onClick={() => {
                      navigator.clipboard.writeText(userData?.user?.id?.toString() || '');
                    }}
                  >
                    <CopyIcon size={20} className="cursor-pointer" />
                  </div>
                </>
              )}
            </div> */}
          </div>
          <div className="flex items-center justify-between space-x-4 mt-1">
            <div className="flex items-center w-1/3"></div>
            <div className="flex items-center w-2/3 border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-w-64">
              <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
              <div className="flex-1 text-center">
                <p className="text-xs text-[#85827d] font-medium"></p>
                <div className="flex items-center justify-center space-x-1">
                  {!activated && (
                    <>
                      <p className="text-sm">{score.toFixed(1)}</p>
                    </>
                  )}
                </div>
              </div>

              {showResult && !activated && (
                <>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => {
                      setIsWithdraw(true);
                    }}
                  >
                    <p className="text-sm">Выводить</p>
                    <div className=" h-[32px]  w-[2px] bg-[#43433b] mx-2">
                      <Settings className="text-white" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
          <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
            <div className="px-4 mt-6 flex justify-between gap-2"></div>
            {isWithdraw ? (
              <div className="flex flex-col items-start self-center   relative">
                <div
                  className="flex cursor-pointer self-end items-center w-fit border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-w-64"
                  onClick={() => setIsWithdraw(false)}
                >
                  Закрыть
                </div>
                <p className="text-sm self-center text-center mt-2">
                  Введите свой код {userData?.user?.id} в течении 72 часов в игре в меню "Рефералы"
                  чтобы получить свои деньги.
                </p>
                <div
                  className="flex self-center cursor-pointer mt-2 items-center w-fit border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-w-64"
                  onClick={() => setIsWithdraw(false)}
                >
                  Ок
                </div>
                <div className="flex items-center self-center gap-1 mt-4">
                  {showResult && !activated && (
                    <>
                      <p className="text-sm"> {userData?.user?.id}</p>

                      <div
                        className="flex   cursor-pointer  items-center w-fit border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-w-64"
                        onClick={() => {
                          navigator.clipboard.writeText(userData?.user?.id?.toString() || '');
                        }}
                      >
                        Копировать
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : showResult ? (
              <Referals />
            ) : (
              <div className="flex flex-1 flex-col items-center relative justify-center w-full">
                <div className=" flex flex-col gap-y-2 items-center top-1 w-full px-2">
                  {gameStart ? (
                    <div
                      className="flex w-full h-2.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700"
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="flex flex-col justify-center rounded-full overflow-hidden bg-teal-500 text-xs text-white text-center whitespace-nowrap transition duration-500"
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
                  <>
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
                    <div className="flex flex-col items-center w-full">
                      <p className="text-sm mt-4 text-center">За правильный ответ: +0.1 руб</p>
                      <p className="text-sm text-center">За провал: -0.5 руб</p>
                    </div>
                  </>
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
