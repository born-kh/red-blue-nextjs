'use client';
import { useEffect, useState } from 'react';

// import { useCloudStorage, useMainButton, usePopup } from '@telegram-apps/sdk-react';
import './game.css';
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
  // const storage = useCloudStorage();
  // const popup = usePopup();
  // const mainButton = useMainButton();

  const [score, setScore] = useState(0);
  const [money, setMoney] = useState(() => {
    return 0;
  });
  useEffect(() => {
    setButtons(generateButtons(4));
    // storage.get('money').then((result) => setMoney(Number(result || '0')));
  }, []);

  const handleCellClick = (color: Button) => {
    if (color[0].toLowerCase() === color[1].toLowerCase()) {
      setScore((prev) => prev + 1);
      if (score > 10) {
        setMoney((money) => {
          // storage.set('money', String(money + 0.1));
          return money + 0.1;
        });
      }
    }
    setButtons(generateButtons(4));
  };
  useEffect(() => {
    // if (money >= 10) {
    //   popup
    //     .open({
    //       title: 'Hello!',
    //       message: 'Вы заработали 10 руб. Хотите выводить?',
    //       buttons: [
    //         { id: 'later', type: 'default', text: 'Позже' },
    //         { id: 'later', type: 'default', text: 'Да' },
    //       ],
    //     })
    //     .then((buttonId) => {
    //       console.log(
    //         buttonId === null
    //           ? 'User did not click any button'
    //           : `User clicked a button with ID "${buttonId}"`
    //       );
    //     });
    // }

    const getData = async () => {
      const response = await fetch('/api/db', {
        method: 'GET',
      });
      return response.json();
    };
    getData().then((data) => {
      alert(data.message);
    });
  }, [money]);

  return (
    <div className="game">
      <div className="game-header">
        <p className="game-title">Кликать на ту ячейку, у которой текст и цвет совпадают.</p>
        <p className="game-anwsers-info">Правилных ответов: {score}</p>
      </div>

      <div className="game-container">
        {buttons.map((button, index) => {
          let img = `/${button[0]}.png`;
          return (
            <div
              style={{ backgroundImage: `url(${img})` }}
              className="grid-item"
              key={index}
              onClick={() => handleCellClick(button)}
            >
              {button[1]}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Game;
