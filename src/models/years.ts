import { model, Schema, Document } from "mongoose";

export interface IYear extends Document {
    year: number;
    attacks: string[];
    numOfAttacks: INumOfAttacks[];
}

interface INumOfAttacks {
    month: number;
    numOfAttacks: number;
}

const numOfAttacksSchema = new Schema<INumOfAttacks>({
    month: {
        type: Number,
        required: true
    },
    numOfAttacks: {
        type: Number,
        required: true
    }
});

export const yearSchema = new Schema<IYear>({
    year: {
        type: Number,
        required: true,
        unique: true
    },
    numOfAttacks: [numOfAttacksSchema], 
    attacks: [{
        type: Schema.Types.ObjectId,
        ref: "Attacks"
    }]
});

export const Year = model<IYear>("Years", yearSchema);
