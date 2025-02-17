// crawl.js
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(express.json());

// Endpoint to crawl a URL and list links
app.post('/crawl', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Please provide a URL.' });
  }

  try {
    // Fetch the HTML content from the given URL
    const response = await axios.get(url);
    const html = response.data;

    // Load the HTML into Cheerio
    const $ = cheerio.load(html);

    // Array to hold extracted links
    const links = [];

    // Extract all anchor tags and their href attributes
    $('a').each((index, element) => {
      const href = $(element).attr('href');
      if (href) {
        links.push(href);
      }
    });

    // Return the list of links
    res.json({ url, links });
  } catch (error) {
    console.error('Error fetching URL:', error);
    res.status(500).json({ error: 'Failed to fetch or parse the URL.' });
  }
});

// Start the server on a port (e.g., 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Crawl server running on port ${PORT}`);
});
