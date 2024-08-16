'use client';

import { useInitData, useUtils } from '@tma.js/sdk-react';

export default function ({ balance }: { balance: number }) {
  const userData = useInitData();
  const utils = useUtils();
  return (
    <div className="flex flex-col items-center justify-center gap-y-4">
      <div className="flex-row flex items-center gap-x-2">
        <span>Ваш баланс {balance} руб</span>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Выводить
        </button>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          utils.openTelegramLink(
            `https://t.me/share/url?url=http://t.me/red_blue_game_bot?start=fren=${userData?.user?.id}`
          );
        }}
      >
        Пригласить
      </button>
      <button
        onClick={() => {
          utils.openTelegramLink(`https://t.me/TezTezDiscussion`);
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Обсуждение
      </button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Список рефералов
      </button>
    </div>
  );
}
