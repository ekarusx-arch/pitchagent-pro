import * as cheerio from "cheerio";

/**
 * 주어진 URL의 웹페이지 내용을 Fetch하고 주요 텍스트 내용만 추출합니다.
 */
export async function scrapeWebsiteContent(url: string): Promise<string> {
    try {
        // 1. 기본 Fetch 실행 (시간 제한 및 헤더 추가로 차단 방지)
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            },
            next: { revalidate: 3600 } // 한 번 크롤링한 데이터는 동일 URL에 대해 1시간 캐싱
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
        }

        const html = await response.text();

        // 2. Cheerio를 이용해 HTML 파싱
        const $ = cheerio.load(html);

        // 불필요한 태그 제거 (스크립트, 스타일, 네비게이션, 푸터 등 노이즈 제거)
        $('script, style, noscript, iframe, img, svg, header, footer, nav, aside').remove();

        // 3. 순수 텍스트 추출 및 정제
        let text = $('body').text() || $('html').text();

        // 다중 공백, 탭, 개행 문자 정리
        text = text.replace(/\s+/g, ' ').trim();

        // 입력 컨텍스트 한계(토큰 수 제한)를 고려해 최대 3000자로 제한
        return text.substring(0, 3000);

    } catch (error: any) {
        console.warn(`Scraping failed for ${url}:`, error.message);
        // 에러 발생 시 빈칸 반환
        return "[Could not scrape website content. Error: " + error.message + "]";
    }
}
