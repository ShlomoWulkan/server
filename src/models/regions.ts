import { model, Schema } from "mongoose";

interface IRegion {
    name: string;
    attacks: string[];
}

export const regionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    attacks : [{
        type: Schema.Types.ObjectId,
        ref: "Attacks"
    }]
});

export const Region = model<IRegion>("Regions", regionSchema);
