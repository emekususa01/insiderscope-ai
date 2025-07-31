
import axios from 'axios';
import xml2js from 'xml2js';

export default async function handler(req, res) {
  try {
    const feedUrl = 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=4&owner=only&count=100&output=atom';
    const response = await axios.get(feedUrl, {
      headers: {
        'User-Agent': 'InsiderScopeAI/1.0 (your@email.com)',
        'Accept-Encoding': 'gzip, deflate',
        'Accept': 'application/atom+xml',
      }
    });

    const xml = response.data;
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xml);

    const entries = result.feed.entry || [];
    const filings = entries.map(entry => {
      const title = entry.title[0];
      const summary = entry.summary[0]._;
      const link = entry.link[0].$.href;
      const updated = entry.updated[0];

      const match = title.match(/(.*?) \((.*?)\)\s+-\s+(.*?)\s+\((.*?)\)/);
      const company = match ? match[1].trim() : 'Unknown';
      const insider = match ? match[3].trim() : 'Unknown';

      return {
        company,
        insider,
        transaction_type: 'unspecified',
        amount: 0,
        role: 'Unknown',
        date: updated,
        link,
        summary: summary || ''
      };
    });

    res.status(200).json(filings);
  } catch (error) {
    console.error('SEC API error:', error);
    res.status(500).json({ error: 'Failed to fetch SEC filings' });
  }
}
