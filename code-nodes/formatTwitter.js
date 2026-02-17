// n8n Code Node: Format Twitter/X Post
// Mode: Run Once for All Items
// Purpose: Creates a tweet within the 280-character limit with hashtags
//          and a call-to-action. Handles truncation gracefully.
//          Output is SIMULATED (not posted to Twitter API).

const items = $input.all();

return items.map(item => {
  const d = item.json;
  const t = d.template;

  const hashtags = t.hashtags.slice(0, 2).join(' ');

  // Build tweet components
  const headline = `${t.emoji.primary} On recrute : ${d.title} chez ${d.company} !`;
  const details = `${d.location} | ${d.jobType} | ${d.salary}`;
  const cta = 'Postulez :';

  // Twitter counts URLs as 23 chars (t.co wrapping)
  const tcoLength = 23;

  // Try full version first
  const fullTweet = `${headline}\n${details}\n\n${cta} ${d.applyUrl}\n\n${hashtags}`;
  const fullLength = headline.length + 1 + details.length + 2 + cta.length + 1 + tcoLength + 2 + hashtags.length;

  let tweet;
  if (fullLength <= 280) {
    tweet = fullTweet;
  } else {
    // Shorter version without salary
    const shortDetails = `${d.location} | ${d.jobType}`;
    tweet = `${headline}\n${shortDetails}\n\n${cta} ${d.applyUrl}\n\n${hashtags}`;
  }

  // Final safety truncation
  if (tweet.length > 280) {
    tweet = tweet.substring(0, 277) + '...';
  }

  // Simulate Twitter API response
  const twitterResult = {
    platform: 'Twitter',
    status: 'Simulated',
    simulatedTweetId: `tw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    characterCount: tweet.length,
    withinLimit: tweet.length <= 280,
    content: tweet,
    timestamp: new Date().toISOString(),
    note: 'SIMULATED: Twitter/X API requires paid tier. This represents what would be tweeted.'
  };

  console.log('=== TWITTER POST (SIMULATED) ===');
  console.log(tweet);
  console.log(`Characters: ${tweet.length}/280`);
  console.log('================================');

  return {
    json: {
      ...d,
      twitterPost: tweet,
      twitterResult
    }
  };
});
