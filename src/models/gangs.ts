import { model, Schema } from "mongoose";

export interface IGang extends Document{
    name: string;
    attacks: string[];
}

export const gangSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    attacks : [{
        type: Schema.Types.ObjectId,
        ref: "Attacks"
    }]
});

export const Gang = model<IGang>("Gangs", gangSchema);