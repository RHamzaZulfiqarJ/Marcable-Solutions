import { model, Schema } from 'mongoose';

const facebookEventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
});

const facebookEventModel = model('facebookEvent', facebookEventSchema);

export default facebookEventModel;