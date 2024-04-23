const axios = require('axios');
const cheerio = require('cheerio');

async function scrapSite(page) {
  /***
   * @page is what page you want to scrap, select any page except 0
   */
  try {
    const response = await axios.get(page ? `https://seegore.com/gore/page/${page}` : 'https://seegore.com/gore');
    const $ = cheerio.load(response.data);
    const links = [];
    $('img.attachment-boombox_image360x270').each((index, element) => {
      const image = $(element).attr('src');
      const data = { image };
      const parent = $(element).closest('.post-item');
      const link = parent.find('a[rel="bookmark"]').attr('href');
      const title = parent.find('a[rel="bookmark"]').text();
      links.push({ title, link, ...data });
    });

    return links
  } catch (err) {
    throw err;
  }
}

async function getStreamLink(link) {
  try {
  if (!link) {
    throw new Error("No Page Link Provided")
  }
  const { data: html } = await axios.get(link);
  const $ = cheerio.load(html);
  const videoSrc = $('video.wp-video-shortcode source').attr('src');
  return videoSrc;
  } catch (err) {
    throw err
  }
}

scrapSite().then(res => console.log(res));

// getStreamLink('link').then(x => console.log(x))