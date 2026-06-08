const OpenAI = require("openai");
const fs = require("fs/promises");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function correctWeeklyHighlights() {
  const data = JSON.parse(await fs.readFile("./data/test-Data.json", "utf-8"));

  const prompt = `
Please correct the grammar and rewrite the following weekly highlights in a professional format.

${JSON.stringify(data, null, 2)}

Return only the corrected highlights.
`;

  const response = await client.chat.completions.create({
    model: "gpt-5.3-chat-latest",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const correctedText = response.choices[0].message.content;

  await fs.writeFile("./data/corrected-highlights.txt", correctedText, "utf-8");

  console.log(correctedText);

  return correctedText;
}

module.exports = { correctWeeklyHighlights };
