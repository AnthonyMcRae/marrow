// Serverless proxy: the browser calls /api/claude, this runs on Netlify's
// servers and forwards to Anthropic with your secret key attached.
// Your ANTHROPIC_API_KEY never reaches the browser.
export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "ANTHROPIC_API_KEY is not set. Add it in Netlify → Site settings → Environment variables." }),
    };
  }
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: event.body, // { model, max_tokens, messages } forwarded verbatim
    });
    const text = await r.text();
    return { statusCode: r.status, headers: { "content-type": "application/json" }, body: text };
  } catch (e) {
    return { statusCode: 502, body: JSON.stringify({ error: String(e) }) };
  }
};
