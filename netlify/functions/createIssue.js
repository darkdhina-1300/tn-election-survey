const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const { name, mobile, email, city, pincode, vote, comment } = data;

    const issueTitle = `Survey response from ${name}`;
    const issueBody = `
Name: ${name}
Mobile: ${mobile}
Email: ${email}
City: ${city}
PinCode: ${pincode}
Vote: ${vote}
Comment: ${comment}
    `;

    const response = await fetch("https://api.github.com/repos/darkdhina-1300/tn-election-survey/issues", {
      method: "POST",
      headers: {
        Authorization: `token ${process.env.GH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: issueTitle, body: issueBody }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return { statusCode: 200, body: JSON.stringify({ message: "Issue created" }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
