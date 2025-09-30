// netlify/functions/createIssue.js
exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (e) { return { statusCode: 400, body: 'Invalid JSON' }; }

  const { name, mobile, city, pincode, vote, email, comments } = body;
  if (!name || !mobile || !city || !pincode || !vote) return { statusCode: 400, body: 'Missing required fields' };

  const issueTitle = `New Survey Response from ${name}`;
  const issueBody =
    `**Name:** ${name}\n` +
    `**Mobile:** ${mobile}\n` +
    `**City:** ${city}\n` +
    `**Pin Code:** ${pincode}\n` +
    `**Vote:** ${vote}\n` +
    `**Email:** ${email || 'N/A'}\n` +
    `**Comments:** ${comments || 'N/A'}\n`;

  const owner = 'YOUR-USERNAME';
  const repo = 'tn-election-survey';
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { statusCode: 500, body: 'Missing token' };

  try {
    const ghRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: issueTitle, body: issueBody })
    });
    const text = await ghRes.text();
    if (!ghRes.ok) return { statusCode: ghRes.status, body: `GitHub error: ${text}`, headers: { 'Access-Control-Allow-Origin': '*' } };
    const json = JSON.parse(text);
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ ok: true, issue_url: json.html_url }) };
  } catch (err) { return { statusCode: 500, body: 'Server error' }; }
};
