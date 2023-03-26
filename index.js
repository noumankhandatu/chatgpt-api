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

app.post("/chatgpt", async (req, res, context) => {
  const { prompt } = req.body;
  try {
    const timeout = 30; // set the timeout to 30 seconds
    const response = await openai
      .createChatCompletion(
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        },
        {
          timeout:
            Math.floor(context.getRemainingTimeInMillis() / 1000) - timeout, // subtract the desired timeout from the remaining time
        }
      )
      .catch((err) => {
        console.log(err, "the error");
      });
    if (response) {
      return res
        .status(200)
        .send({ message: response?.data?.choices[0]?.message.content });
    }
  } catch (error) {
    console.log(error);
    return false;
  }
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
