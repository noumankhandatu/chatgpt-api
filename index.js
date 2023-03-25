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
  organization: "org-Vg40kkVMaLs2zaEpLZypqvAp",
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/chatgpt", async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 250, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });
    return res.status(200).send({ message: response.data.choices[0].text });
  } catch (error) {
    console.log(error);
    return false;
  }
});

app.listen(PORT, () => {
  console.log("server up and running");
});
