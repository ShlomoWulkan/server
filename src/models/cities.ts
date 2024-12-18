import { model, Schema } from "mongoose";

interface ICity {
    name: string;
    attacks: string[];
}

export const citySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    attacks : [{
        type: Schema.Types.ObjectId,
        ref: "Attacks"
    }]
});

export const City = model<ICity>("Cities", citySchema);
