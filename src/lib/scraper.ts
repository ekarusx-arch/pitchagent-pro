import * as cheerio from "cheerio";

/**
 * Fetches the content of a given URL and extracts main text content.
 */
export async function scrapeWebsiteContent(url: string): Promise<string> {
    try {
        // 1. Execute basic fetch (anti-block headers included)
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            },
            next: { revalidate: 3600 } // Cache data for 1 hour for same URL
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
        }

        const html = await response.text();

        // 2. Parse HTML using Cheerio
        const $ = cheerio.load(html);

        // Remove unnecessary tags (noise reduction)
        $('script, style, noscript, iframe, img, svg, header, footer, nav, aside').remove();

        // 3. Extract and clean pure text
        let text = $('body').text() || $('html').text();

        // Clean whitespace
        text = text.replace(/\s+/g, ' ').trim();

        // Limit to 3000 chars for token limits
        return text.substring(0, 3000);

    } catch (error: any) {
        console.warn(`Scraping failed for ${url}:`, error.message);
        // Return empty on error
        return "[Could not scrape website content. Error: " + error.message + "]";
    }
}
