const axios = require("axios");
const router = require("express").Router();
const Job = require("../models/Job.model");
const CoverLetter = require("../models/CoverLetter.model");

//

router.post("/job/:jobId/cover-letter", async (req, res, next) => {
  try {
    // here we are preparing the prompt for our call to open AI:
    //const { title, description } = req.body;
    /*   const title = "";
  const description = "";

  Job.findById(req.params)
    .then((foundJob) => {
      title = foundJob.title;
      description = foundJob.description;
    })
    .catch((err) => console.log(err)); */

    const { jobId } = req.params;
    const writeCommand = "write a cover letter for a job";
    //const prompt = title + " " + description + " " + writeCommand;

    //we now make the call to the API with axios:
    // https://api.openai.com/v1/engines/text-davinci-002/completions

    let body = {
      prompt: writeCommand,
      max_tokens: 1000,
      temperature: 0.6,
    };

    let opeanAiResponse = await axios.post(
      `https://api.openai.com/v1/engines/text-davinci-002/completions`,
      body,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_BEARER_TOKEN}`,
        },
      }
    );

    let coverLetterText = opeanAiResponse.data.choices[0].text; // if the response.choices.text os not a String, needs to convert to string

    let newCoverLetter = await CoverLetter.create({ text: coverLetterText });

    let updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $push: { coverLetter: newCoverLetter._id } },
      { new: true }
    );

    res.status(200).json(newCoverLetter);
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
