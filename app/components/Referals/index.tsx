import { useInitData } from '@tma.js/sdk-react';
import { useEffect, useState } from 'react';

const Referals = () => {
  const [openTab, setOpenTab] = useState(1);
  const [friends, setFriends] = useState<any[]>([]);
  const initData = useInitData();
  useEffect(() => {
    const getData = async () => {
      const response = await fetch(`/api/referals?id=${initData?.user?.id}`, {
        method: 'GET',
      });
      return response.json();
    };
    if (initData?.user) {
      getData()
        .then((data) => {
          console.log(data);
          setFriends(data.friends as any);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [initData]);
  return (
    <>
      <div className="flex flex-wrap w-full">
        <div className="w-full">
          <ul className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row" role="tablist">
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                  (openTab === 1 ? 'text-white bg-blue-500' : 'text-blueGray-600 bg-white')
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
                  (openTab === 2 ? 'text-white bg-blue-500' : 'text-blueGray-600 bg-white')
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
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <div className={openTab === 1 ? 'block' : 'hidden'} id="link1">
                  <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
                    {friends.map((friend, index) => {
                      return (
                        <li className="pt-3 pb-0 sm:pt-4 w-full" key={'friend' + index}>
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            :{' '}
                            <div className="flex flex-col items-start min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate ">
                                {index + 1} {friend.first_name + ' ' + friend.last_name}
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
                            :{' '}
                            <div className="flex flex-col items-start min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate ">
                                {index + 1} {friend.first_name + ' ' + friend.last_name}
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
    </>
  );
};

export default Referals;
