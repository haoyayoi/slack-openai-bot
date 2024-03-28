import { App, LogLevel } from "@slack/bolt";
import OpenAI from "openai";

const app = new App({
  socketMode: true,
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG,
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

// 質問に対する回答を取得する関数
async function getAnswer(question: string) {
  try {
    // OpenAI API を使用して質問に答えを取得する
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", "content": question}]
    });

    // 回答を返す
    return completion.choices[0].message;
  } catch (error) {
    console.error('Error fetching answer:', error);
    return 'Sorry, I couldn\'t find an answer to that question.';
  }
}

app.command("/faq", async ({ command, ack, say, respond }) => {
  await ack({
    text: "",
    response_type: "in_channel",
  });
  await say("Hello from say");
  await respond({
    response_type: "ephemeral",
    text: "Hello from respond ephemeral",
  });
  await respond({
    response_type: "in_channel",
    text: "Hello from respond in_channel",
  });
  const result = getAnswer(`${command.text}`)
  console.log(result)
  await respond(``);
});

app.event("app_mention", async ({ say }) => {
  await say("Hi");
});

;(async () => {
  await app.start();
  console.log("⚡️ Bolt app is running!");
})();

