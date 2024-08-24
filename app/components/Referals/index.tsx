import Discuss from '@/app/icons/Discuss';
import Friends from '@/app/icons/Friends';
import Info from '@/app/icons/Info';
import { useInitData, useUtils } from '@tma.js/sdk-react';
import { useEffect, useState } from 'react';

const Referals = () => {
  const [openTab, setOpenTab] = useState(1);
  const [friends, setFriends] = useState<any[]>([]);
  const userData = useInitData();
  const utils = useUtils();
  useEffect(() => {
    const getData = async () => {
      const response = await fetch(`/api/referals?id=${userData?.user?.id}`, {
        method: 'GET',
      });
      return response.json();
    };
    if (userData?.user) {
      getData()
        .then((data) => {
          console.log(data);
          setFriends(data.friends as any);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userData]);
  return (
    <div className="flex flex-col flex-grow gap-2 items-start">
      <div className=" self-center  w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] flex justify-around items-center z-50 rounded-3xl text-xs">
        <div
          className="text-center text-[#85827d] w-1/3 cursor-pointer "
          onClick={() => {
            utils.openTelegramLink(`https://t.me/TezTezDiscussion`);
          }}
        >
          <Discuss className="w-8 h-8 mx-auto" />
          <p className="mt-1">обсуждение</p>
        </div>
        <div
          className="text-center text-[#85827d] w-1/3 cursor-pointer"
          onClick={() => {
            utils.openTelegramLink(
              `https://t.me/share/url?url=http://t.me/red_blue_game_bot?start=fren=${userData?.user?.id}`
            );
          }}
        >
          <Friends className="w-8 h-8 mx-auto" />
          <p className="mt-1">Пригласить</p>
        </div>
        <div className="text-center text-[#85827d] w-1/3 cursor-pointer">
          <Info className="w-8 h-8 mx-auto" />
          <p className="mt-1">Инфо</p>
        </div>
      </div>

      <div className="flex flex-col w-full">
        <h2 className=" font-bold py-2 px-4 rounded mt-4">Список рефералов</h2>
        <div className="flex flex-wrap w-full">
          <div className="w-full">
            <ul className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row" role="tablist">
              <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                <a
                  className={
                    'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                    (openTab === 1 ? 'text-white bg-[#43433b]' : 'text-blueGray-600 ')
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(1);
                  }}
                  data-toggle="tab"
                  href="#link1"
                  role="tablist"
                >
                  Активные:
                </a>
              </li>
              <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                <a
                  className={
                    'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                    (openTab === 2 ? 'text-white bg-[#43433b]' : 'text-blueGray-600 ')
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(2);
                  }}
                  data-toggle="tab"
                  href="#link2"
                  role="tablist"
                >
                  Не активные
                </a>
              </li>
            </ul>
            <div className="relative flex flex-col min-w-0 break-words bg-[#272a2f] w-full mb-6 shadow-lg rounded">
              <div className="px-4 py-5 flex-auto">
                <div className="tab-content tab-space">
                  <div className={openTab === 1 ? 'block' : 'hidden'} id="link1">
                    <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
                      {friends.map((friend, index) => {
                        return (
                          <li className="pt-3 pb-0 sm:pt-4 w-full" key={'friend' + index}>
                            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                              <div className="flex flex-col items-start min-w-0">
                                <p className="text-sm font-medium text-[#85827d] truncate ">
                                  {index + 1}: {friend.first_name + ' ' + (friend.last_name || '')}
                                </p>
                                {friend.username && (
                                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                    @{friend.username}
                                  </p>
                                )}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className={openTab === 2 ? 'block' : 'hidden'} id="link2">
                    <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
                      {friends.map((friend, index) => {
                        return (
                          <li className="pt-3 pb-0 sm:pt-4 w-full" key={'friend' + index}>
                            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                              <div className="flex flex-col items-start min-w-0">
                                <p className="text-sm font-medium text-[#85827d] truncate ">
                                  {index + 1}: {friend.first_name + ' ' + (friend.last_name || '')}
                                </p>
                                {friend.username && (
                                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                    @{friend.username}
                                  </p>
                                )}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referals;
