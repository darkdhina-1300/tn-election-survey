exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    // GitHub repo details
    const GITHUB_USER = "darkdhina-1300";
    const REPO_NAME = "tn-election-survey";

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/issues`,
      {
        method: "POST",
        headers: {
          "Authorization": `token ${process.env.GH_TOKEN}`,
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
      const errorText = await response.text();
      throw new Error(
        `GitHub API error: ${response.status} - ${response.statusText}\nDetails: ${errorText}`
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success" }),
    };
  } catch (err) {
    console.error("❌ Netlify Function Error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Netlify Function failed",
        details: err.message,
      }),
    };
  }
};
