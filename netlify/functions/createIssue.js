// Netlify function - createIssue.js
// Uses node-fetch (installed via package.json). Requires GH_TOKEN in Netlify env.
const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
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

    const body = JSON.parse(event.body || '{}');

    // validate
    const required = ['name','mobile','city','pincode','vote'];
    for (const f of required) {
      if (!body[f]) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing field: ' + f }) };
      }
    }

    const GITHUB_USER = 'darkdhina-1300';
    const REPO_NAME = 'tn-election-survey';
    const token = process.env.GH_TOKEN;
    if (!token) return { statusCode: 500, body: JSON.stringify({ error: 'Server misconfigured: GH_TOKEN missing' }) };

    const issueTitle = `New Survey Response from ${body.name}`;
    const issueBody =
      `**Name:** ${body.name}\n` +
      `**Mobile:** ${body.mobile}\n` +
      `**City:** ${body.city}\n` +
      `**Pin Code:** ${body.pincode}\n` +
      `**Vote:** ${body.vote}\n` +
      `**Email:** ${body.email || 'N/A'}\n` +
      `**Comment:** ${body.comment || 'N/A'}\n`;

    const ghRes = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: issueTitle, body: issueBody })
    });

    const ghText = await ghRes.text();
    let ghJson = null;
    try { ghJson = JSON.parse(ghText); } catch (e) {}

    if (!ghRes.ok) {
      return {
        statusCode: ghRes.status,
        body: JSON.stringify({ error: 'GitHub API error', details: ghText })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success', issue: ghJson && ghJson.html_url })
    };
  } catch (err) {
    console.error('Function error', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', details: err.message })
    };
  }
};
