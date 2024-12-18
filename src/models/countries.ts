import { model, Schema } from "mongoose";

interface ICountry {
    name: string;
    attacks: string[];
}

export const countrySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    attacks : [{
        type: Schema.Types.ObjectId,
        ref: "Attacks"
    }]
});

export const Country = model<ICountry>("Countries", countrySchema);
