const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = 5000;
app.use(express.json());
app.use(
  cors({
    origin: "*", // replace with your frontend's domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
const configuration = new Configuration({
  organization: process.env.ORG_KEY,
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/chatgpt", async (req, res) => {
  const { prompt } = req.body;
  const MAX_PROMPT_LENGTH = 2048; // Maximum prompt length allowed by OpenAI API
  const promptParts = [];
  for (let i = 0; i < prompt.length; i += MAX_PROMPT_LENGTH) {
    promptParts.push(prompt.slice(i, i + MAX_PROMPT_LENGTH));
  }
  let responseParts = [];
  for (let i = 0; i < promptParts.length; i++) {
    const response = await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: promptParts[i] }],
      })
      .catch((err) => {
        console.log(err, "the error");
      });
    if (response) {
      responseParts.push(response?.data?.choices[0]?.message.content);
    }
  }
  const response = responseParts.join("");
  return res.status(200).send({ message: response });
});
app.get("/", (req, res) => {
  res.send("hello world");
});
app.post("/testing", (req, res) => {
  return res.send(process.env.ORG_KEY);
});
app.listen(PORT, () => {
  console.log("server up and running");
});
