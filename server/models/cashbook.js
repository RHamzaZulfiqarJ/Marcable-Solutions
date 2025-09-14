import { Schema, model } from 'mongoose'
import { generateUniqueIdentifier } from '../utils/utils.js'

const cashbookSchema = Schema({
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: false }, // to show cashbook in ledger
    type: { type: String, required: false, enum: ['in', 'out'] },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: false },
    branch: { type: String, required: false },
    staff: { type: String, required: false },
    clientName: { type: String, required: false },
    remarks: { type: String, required: false },
    top: { type: String, required: false },
    number: { type: String, required: false },
    amount: { type: Number, required: false },
    uid: { type: String },
}, { timestamps: true })


// Before saving a new document, generate a unique readable identifier
cashbookSchema.pre('save', async function (next) {
    if (!this.uid) {
        let isUnique = false;
        let generatedIdentifier;

        while (!isUnique) {
            // Generate a unique identifier (you can use a library for this)
            generatedIdentifier = generateUniqueIdentifier();

            // Check if it's unique in the collection
            const existingDocument = await this.constructor.findOne({ uid: generatedIdentifier });

            if (!existingDocument) {
                isUnique = true; // Identifier is unique, exit the loop
            }
        }

        // Assign the generated identifier to the document
        this.uid = generatedIdentifier;
    }
    next();
});


const cashbookModel = model('Cashbook', cashbookSchema)
export default cashbookModel