
import axios from 'axios';
import { load } from 'cheerio';

export const crawlWebsite = async (url: string) => {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = load(html);
    const links: string[] = [];

    $('a').each((_, el) => {
      const href = $(el).attr('href');
      if (href && !href.startsWith('#')) {
        // Convert relative URLs to absolute URLs
        const absoluteUrl = new URL(href, url).toString();
        links.push(absoluteUrl);
      }
    });

    const title = $('title').text();
    const content = $('body').text().trim();

    return {
      title,
      content,
      links
    };
  } catch (error) {
    console.error('Error crawling URL:', error);
    throw new Error('Failed to crawl URL');
  }
};
