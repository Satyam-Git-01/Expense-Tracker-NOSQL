const { Schema, model } = require("mongoose");
const FileSchema = new Schema({
  url: {
    type: String,
    required: false,
  },
  generatedOn: {
    type: String,
    required: false,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref:"users",
    required: false,
  },
});
const FileDownloadedModel = model("files", FileSchema);
module.exports = FileDownloadedModel;
