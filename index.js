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
  organization: "org-K4LL8hxlhBAKP3i7ZRZAib8W",
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/chatgpt", async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      })
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

app.listen(PORT, () => {
  console.log("server up and running");
});
