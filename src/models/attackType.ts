import { model, Schema } from "mongoose";

interface IAttackType {
    name: string;
    attacks: string[];
}

export const attackTypeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    attacks : [{
        type: Schema.Types.ObjectId,
        ref: "Attacks"
    }]
});

export const AttackType = model<IAttackType>("AttackType", attackTypeSchema);
