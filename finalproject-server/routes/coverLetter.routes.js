const axios = require("axios");
const router = require("express").Router();
const Job = require("../models/Job.model");
const CoverLetter = require("../models/CoverLetter.model");

//

router.post("/job/:id/cover-letter", (req, res, next) => {
  // here we are preparing the prompt for our call to open AI:
  const { title, description } = req.body;
  const { jobId } = req.params;
  const writeCommand = "write a cover letter for this job application";
  const prompt = title + " " + description + " " + writeCommand;

  //we now make the call to the API with axios:
  // https://api.openai.com/v1/engines/text-davinci-002/completions
  axios
    .post(`https://api.openai.com/v1/engines/text-davinci-002/completions`, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_BEARER_TOKEN}`,
      },
      body: {
        prompt: prompt,
        max_tokens: 1000,
        temperature: 0.6,
      },
    })
    .then((response) => {
      res.json(response.choices.text);
      let coverLetterText = response.choices.text; // if the response.choices.text os not a String, needs to convert to string
      return coverLetterText;
    })
    .then((coverLetterText) => {
      CoverLetter.create({ text: coverLetterText }).then((createdCL) =>
        Job.findByIdAndUpdate(
          jobId,
          { $push: { coverLetter: createdCL._id } },
          { new: true }
        )
      );
      res.json(createdCL);
    })
    .catch((err) => res.json(err));
});
