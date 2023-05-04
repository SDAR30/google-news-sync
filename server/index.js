const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/news', async (req, res) => {
  try {
    const response = await axios.get('https://news.google.com/topstories?hl=en-US&gl=US&ceid=US:en');
    const html = response.data;
    const $ = cheerio.load(html);
    const newsArticles = [];

    $('article').each((_idx, el) => {
        const titleElement = $(el).find('h3 > a');
        if (!titleElement.length) {
          return;
        }
      
        const title = titleElement.text();
        const link = `https://news.google.com${titleElement.attr('href').replace('./', '/')}`;
        const source = $(el).find('.wEwyrc').text();
      
        const article = {
          title,
          link,
          source
        };
      
        newsArticles.push(article);
      });
      

    res.json(newsArticles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
