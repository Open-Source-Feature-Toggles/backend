const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema(
  {
    name: { type: Schema.Types.String, require: true },
    features: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Feature',
      },
    ],
    owner: { type: Schema.Types.String, require: true },
    productionApiKey: { type: Schema.Types.String, require: true },
    developmentApiKey: { type: Schema.Types.String, require: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Project', ProjectSchema);
