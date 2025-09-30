// netlify/functions/createIssue.js
const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    // Your GitHub username and repo
    const GITHUB_USER = "darkdhina-1300";
    const REPO_NAME = "tn-election-survey";

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/issues`,
      {
        method: "POST",
        headers: {
          "Authorization": `token ${process.env.GH_TOKEN}`, // Keep token from Netlify env
          "Accept": "application/vnd.github+json",
        },
        body: JSON.stringify({
          title: `New Survey Response from ${body.name}`,
          body: `
**Name:** ${body.name}
**Mobile:** ${body.mobile}
**City:** ${body.city}
**Pin Code:** ${body.pincode}
**Vote:** ${body.vote}
**Email:** ${body.email || "N/A"}
**Comment:** ${body.comment || "N/A"}
          `,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${await response.text()}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
