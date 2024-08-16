'use client';
import { useCallback, useEffect, useState } from 'react';

import './game.css';
import {
  useCloudStorage,
  useInitData,
  usePopup,
  useSDK,
  useUtils,
  useViewport,
} from '@tma.js/sdk-react';
import Result from '../Result';
type Button = [string, string];

const buttons: Button[] = [
  ['red', 'Red'],
  ['green', 'Green'],
  ['blue', 'Blue'],
  ['yellow', 'Yellow'],
];

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
  const storage = useCloudStorage();
  const popup = usePopup();

  const [showButtons, setShowButtons] = useState(true);
  const [effect, setEffect] = useState(false);

  const [score, setScore] = useState(0);
  const [showCountButtons, setShowCountButtons] = useState(4);
  const [money, setMoney] = useState(() => {
    return 0;
  });
  const [showResult, setShowResult] = useState(false);
  useEffect(() => {
    setButtons(generateButtons(showCountButtons));
    storage.get('money').then((result) => {
      const money = Number(result || '0');
      setMoney(money);
      setShowResult(true);
    });
  }, [showCountButtons]);

  const view = useViewport(true);
  const handleCellClick = useCallback(
    (color: Button) => {
      setShowButtons(false);
      if (color[0].toLowerCase() === color[1].toLowerCase()) {
        setScore((prev) => prev + 1);
        if (score > 1) {
          setMoney((money) => {
            storage.set('money', String(money + 1));
            return money + 1;
          });
        }
      }
      setButtons(generateButtons(4));
      setTimeout(() => {
        setShowButtons(true);
      }, 500);
    },

    [showCountButtons, score]
  );
  useEffect(() => {
    if (money >= 10) {
      popup
        .open({
          title: 'Hello!',
          message: 'Вы заработали 10 руб. Хотите выводить?',
          buttons: [
            { id: 'later', type: 'default', text: 'Позже' },
            { id: 'later', type: 'default', text: 'Да' },
          ],
        })
        .then(() => {
          setShowResult(true);
        });
    }

    view?.expand();
  }, [money, view]);
  if (showResult) {
    return <Result balance={money} />;
  }
  return (
    <div className="flex flex-1 items-center relative justify-center">
      <div className="absolute flex flex-col gap-y-2 items-center top-1">
        <p className="text-sm">Кликать на ту ячейку, у которой текст и цвет совпадают.</p>
        <p className="text-lg">Правилных ответов: {score}</p>
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
                  handleCellClick(button);
                  setEffect(true);
                }}
                className={`${effect && 'animate-wiggle'} grid-item`}
                onAnimationEnd={() => setEffect(false)}
              >
                {button[1]}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Game;
