'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

import './game.css';

import Result from '../Result';
import useSound from 'use-sound';
import { useCloudStorage, useInitData, usePopup } from '@tma.js/sdk-react';

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
  const popup = usePopup();

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

  const storage = useCloudStorage();
  const popup = usePopup();
  const increment = useRef(0);
  const initData = useInitData();
  const showCountButtons = useRef(4);
  const [showButtons, setShowButtons] = useState(true);
  const [effect, setEffect] = useState(false);

  const [score, setScore] = useState(0);
  const [playClick] = useSound('/click.mp3');
  const [playGame] = useSound('/game_process.mp3', { volume: 0.25 });
  const [playSuccess] = useSound('/success.mp3');
  const [playWrong] = useSound('/wrong.mp3');

  const [showResult, setShowResult] = useState(false);
  useEffect(() => {
    setButtons(generateButtons(showCountButtons.current));
    // const score = Number(
    //   localStorage.getItem(initData?.user ? initData.user.id.toString() : 'score') || '0'
    // );
    // setScore(score);
    // if (score >= 10) {
    //   setShowResult(true);
    // } else {
    //   playGame();
    // }
  }, [showCountButtons, playGame, initData]);

  const handleCellClick = useCallback(
    (color: Button) => {
      increment.current += 1;
      playGame();
      playClick();

      if (increment.current % 7 === 0) {
        showCountButtons.current += 1;
      }
      setShowButtons(false);
      if (color[0].toLowerCase() === color[1].toLowerCase()) {
        playSuccess();
        setScore((prev) => {
          const score = prev + 1;
          // localStorage.setItem(
          //   initData?.user?.id ? initData.user.id.toString() : 'score',
          //   score.toString()
          // );
          return score;
        });
      } else {
        playWrong();
      }
      setButtons(generateButtons(showCountButtons.current));
      setTimeout(() => {
        setShowButtons(true);
      }, 500);
    },

    [showCountButtons, score]
  );
  useEffect(() => {
    if (score >= 10 && !showResult) {
      popup
        .open({
          title: 'Hello!',
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
  if (showResult) {
    return <Result balance={score} />;
  }
  return (
    <div className="flex flex-1 items-center relative justify-center w-full">
      <div className="absolute flex flex-col gap-y-2 items-center top-1">
        <p className="text-sm">Кликать на ту ячейку, у которой текст и цвет совпадают.</p>
        <p className="text-xl font-bold mt-4">Правилных ответов: {score}</p>
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
  );
}

export default Game;
