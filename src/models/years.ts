import { model, Schema } from "mongoose";

export interface IYear extends Document{
    year: number;
    attacks: string[];
}

export const yearSchema = new Schema({
    year: {
        type: Number,
        required: true,
        unique: true
    },
    // numOfAttacks: {
    //     type: Number
    // },
    attacks : [{
        type: Schema.Types.ObjectId,
        ref: "Attacks"
    }]
});

export const Year = model<IYear>("Years", yearSchema);
