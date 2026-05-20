const https = require('https');

https.get('https://signare-g182.vercel.app/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Look for the main JS bundle
    const scriptMatch = data.match(/<script defer=\"defer\" src=\"(\/static\/js\/main\.[^\"]+\.js)\"><\/script>/);
    if (scriptMatch) {
      console.log('Found script:', scriptMatch[1]);
      https.get('https://signare-g182.vercel.app' + scriptMatch[1], (res2) => {
        let jsData = '';
        res2.on('data', chunk => jsData += chunk);
        res2.on('end', () => {
          // Extract all onrender URLs
          const matches = jsData.match(/https:\/\/[a-zA-Z0-9-]+\.onrender\.com/g);
          console.log('API URLs embedded in code:', [...new Set(matches)]);
        });
      });
    } else {
      console.log('No script found');
    }
  });
});
