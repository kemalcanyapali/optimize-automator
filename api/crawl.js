// /api/crawl.js

import axios from 'axios';
import { load } from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  
  const { url } = req.body;
  if (!url) {
    res.status(400).json({ error: 'URL is required' });
    return;
  }

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = load(html);
    const links = [];

    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href) {
        links.push(href);
      }
    });

    res.status(200).json({ url, links });
  } catch (error) {
    console.error('Error crawling URL:', error);
    res.status(500).json({ error: 'Failed to crawl URL' });
  }
}
