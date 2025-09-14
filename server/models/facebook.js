import { model, Schema } from 'mongoose';

const facebookSchema = new Schema({
    verifyToken: { type: String, required: true },
    pageId: { type: String, required: true },
    appId: { type: String, required: true },
    appSecret: { type: String, required: true },
    pageAccessToken: { type: String, required: true },
});

const facebookModel = model('facebook', facebookSchema);

export default facebookModel;