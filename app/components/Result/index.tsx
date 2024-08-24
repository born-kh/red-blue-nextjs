'use client';

import { useInitData, useUtils } from '@tma.js/sdk-react';
import Referals from '../Referals';

export default function ({ balance }: { balance: number }) {
  const initData = useInitData();
  const utils = useUtils();
  return (
    <div className="flex flex-col flex-grow gap-2 items-start">
      <div className="flex flex-row self-end">
        {' '}
        <div className="flex-row flex items-center gap-x-2">
          <span>Ваш баланс {10} руб</span>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Выводить
          </button>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between gap-2 mt-6">
        <button
          onClick={() => {
            utils.openTelegramLink(`https://t.me/TezTezDiscussion`);
          }}
          className="bg-blue-500 w-fit hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Обсуждение
        </button>{' '}
        <button
          className="bg-blue-500 w-fit hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            utils.openTelegramLink(
              `https://t.me/share/url?url=http://t.me/red_blue_game_bot?start=fren=${initData?.user?.id}`
            );
          }}
        >
          Пригласить
        </button>
        <button
          className="bg-blue-500 w-fit hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            // webApp.(
            //   `https://t.me/share/url?url=http://t.me/red_blue_game_bot?start=fren=${userData?.user?.id}`
            // );
          }}
        >
          Инфо
        </button>
      </div>

      <div className="flex flex-col w-full">
        <h2 className=" font-bold py-2 px-4 rounded mt-4">Список рефералов</h2>
        <Referals />
      </div>
    </div>
  );
}
