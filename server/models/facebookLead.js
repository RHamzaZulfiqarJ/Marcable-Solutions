import { model, Schema } from "mongoose";

const fieldDataSchema = new Schema({
    name: { type: String, required: true },
    values: { type: [String], required: true },
}, { _id: false });

const facebookLeadSchema = new Schema({
  leadId: { type: String, required: true, unique: true },
  createdTime: { type: Date, required: true },
  field_data: { type: [fieldDataSchema], required: true },
  eventTitle: {type: String, required: true},
  status: {type: String, default: 'pending', enum: ['accepted', 'pending', 'rejected']},
});

const FacebookLead = model("fbLead", facebookLeadSchema);

export default FacebookLead;