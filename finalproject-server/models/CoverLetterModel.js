const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const coverLetterSchema = new Schema(
  {
    text: {
      type: String,
    },

    JobId: [{type: Schema.Types.ObjectId, ref: [Job]}]
},
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
  
);

const CoverLetter = model("CoverLetter", coverLetterSchema);

module.exports = CoverLetter;
