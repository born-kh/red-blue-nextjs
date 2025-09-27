import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const youtubeLink = url.searchParams.get('youtubeLink');

    if (!youtubeLink) {
      return NextResponse.json({ error: 'youtubeLink is required' }, { status: 400 });
    }

    let videoId: string | null = null;

    if (youtubeLink.includes('youtube.com/shorts/')) {
      const urlObj = new URL(youtubeLink);
      videoId = urlObj.pathname.split('/').pop() || null;
    } else {
      const urlObj = new URL(youtubeLink);
      videoId = urlObj.searchParams.get('v');
    }

    if (!videoId) {
      return NextResponse.json({ views: null, publishedAt: null }, { status: 200 });
    }

    let realViews: number | null = null;
    if (youtubeLink.includes('youtube.com/shorts/')) {
      realViews = await extractAllViewCounts(videoId);
    }

    const apiKey = 'AIzaSyD-xB7hdB_7mRkKF3QoNankf0XXsqgcTWk';
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoId}&fields=items(id,statistics(viewCount),snippet(publishedAt))&key=${apiKey}`;

    const response = await fetch(apiUrl);
    let apiViews: number | null = null;
    let publishedAt: string | null = null;

    if (response.ok) {
      const data = await response.json();
      apiViews = data.items?.[0]?.statistics?.viewCount ? parseInt(data.items[0].statistics.viewCount, 10) : null;
      publishedAt = data.items?.[0]?.snippet?.publishedAt || null;
    }

    const finalViews = youtubeLink.includes('youtube.com/shorts/') && realViews ? realViews : apiViews;

    return NextResponse.json({ views: finalViews, publishedAt }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



async function extractAllViewCounts(videoId: string) {
    try {
        const url = `https://www.youtube.com/shorts/${videoId}`;
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Cache-Control': 'max-age=0',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();

        // Ищем в JSON данных, которые встроены в HTML
        const jsonDataMatch = html.match(/var ytInitialData = ({.+?});/);
        if (jsonDataMatch) {
            try {
                const jsonData = JSON.parse(jsonDataMatch[1]);
                const views = extractViewsFromJsonData(jsonData);
                if (views) {
                    console.log(`✅ Найдено ${views} просмотров из JSON данных для видео ${videoId}`);
                    return views;
                }
            } catch (jsonError: any) {
                console.log('⚠️ Не удалось распарсить JSON данные:', jsonError?.message || 'Неизвестная ошибка');
            }
        }

        // Ищем различные паттерны просмотров в HTML
        const patterns = [
            // Английский формат: "1.2M views", "1.2K views", "1234 views"
            /([\d,]+(?:\.[\d]+)?[KMB]?)\s*views?/gi,
            // Русский формат: "1,2 млн просмотров", "1,2 тыс просмотров", "1234 просмотров"
            /([\d\s,]+(?:\.[\d]+)?)\s*(?:млн|тыс|тысяч)?\s*просмотров?/gi,
            // Альтернативный английский формат
            /([\d,]+(?:\.[\d]+)?[KMB]?)\s*viewers?/gi,
            // Формат с точками и запятыми
            /([\d\.,]+(?:\.[\d]+)?[KMB]?)\s*views?/gi,
            // Просто числа с пробелами
            /([\d\s,]+)\s*просмотров?/gi,
        ];

        for (const pattern of patterns) {
            const matches = Array.from(html.matchAll(pattern));
            for (const match of matches) {
                let viewsStr = match[1].replace(/[\s,]/g, ''); // Убираем пробелы и запятые

                // Обрабатываем сокращения (K, M, B)
                let multiplier = 1;
                if (viewsStr.includes('K') || viewsStr.includes('тыс')) {
                    multiplier = 1000;
                    viewsStr = viewsStr.replace(/[Kтыс]/g, '');
                } else if (viewsStr.includes('M') || viewsStr.includes('млн')) {
                    multiplier = 1000000;
                    viewsStr = viewsStr.replace(/[Mмлн]/g, '');
                } else if (viewsStr.includes('B')) {
                    multiplier = 1000000000;
                    viewsStr = viewsStr.replace(/B/g, '');
                }

                const views = parseFloat(viewsStr) * multiplier;
                
                if (!isNaN(views) && views > 0 && views < 10000000000) { // Проверяем разумные пределы
                    console.log(`✅ Найдено ${views} просмотров для видео ${videoId}`);
                    return Math.floor(views);
                }
            }
        }

        console.log(`⚠️ Не удалось найти просмотры в HTML для ${videoId}`);
        return null;

    } catch (error) {
        console.error(`❌ Ошибка при получении просмотров для ${videoId}:`, error);
        return null;
    }
}

function extractViewsFromJsonData(data: any): number | null {
    try {
        // Рекурсивно ищем данные о просмотрах в JSON структуре
        const findViews = (obj: any): number | null => {
            if (!obj || typeof obj !== 'object') return null;
            
            // Проверяем ключи, которые могут содержать просмотры
            const viewKeys = ['viewCount', 'view_count', 'views', 'viewCountText', 'shortViewCountText'];
            
            for (const key of viewKeys) {
                if (obj[key] && typeof obj[key] === 'string') {
                    const views = parseViewCount(obj[key]);
                    if (views) return views;
                }
            }
            
            // Рекурсивно проверяем все свойства объекта
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const result = findViews(obj[key]);
                    if (result) return result;
                }
            }
            
            return null;
        };
        
        return findViews(data);
    } catch (error) {
        console.log('Ошибка при извлечении просмотров из JSON:', error);
        return null;
    }
}

function parseViewCount(viewText: string): number | null {
    try {
        // Убираем лишние символы
        let cleanText = viewText.replace(/[^\d\.,KMBтысмлн]/g, '');
        
        // Обрабатываем сокращения
        let multiplier = 1;
        if (cleanText.includes('K') || cleanText.includes('тыс')) {
            multiplier = 1000;
            cleanText = cleanText.replace(/[Kтыс]/g, '');
        } else if (cleanText.includes('M') || cleanText.includes('млн')) {
            multiplier = 1000000;
            cleanText = cleanText.replace(/[Mмлн]/g, '');
        } else if (cleanText.includes('B')) {
            multiplier = 1000000000;
            cleanText = cleanText.replace(/B/g, '');
        }
        
        const views = parseFloat(cleanText.replace(',', '.')) * multiplier;
        
        if (!isNaN(views) && views > 0 && views < 10000000000) {
            return Math.floor(views);
        }
        
        return null;
    } catch (error) {
        return null;
    }
}
