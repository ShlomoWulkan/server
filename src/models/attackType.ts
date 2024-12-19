import { model, Schema } from "mongoose";

export interface IAttackType extends Document {
  name: string;
  attacks: string[];
  numOfCasualties: number; // שדה חדש לסך הנפגעים
}

export const attackTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  attacks: [{
    type: Schema.Types.ObjectId,
    ref: "Attacks"
  }],
  numOfCasualties: {
    type: Number,
    default: 0,  // ערך ברירת מחדל
  },
});

// אגריגציה שמחשב את מספר הנפגעים עבור כל AttackType
attackTypeSchema.statics.calculateCasualties = async function () {
  const attackTypes = await this.aggregate([
    { 
      $lookup: {
        from: "attacks",  // הפנייה לקולקשן התקפות
        localField: "attacks", 
        foreignField: "_id", 
        as: "attackDetails"
      }
    },
    {
      $project: {
        name: 1,
        numOfCasualties: {
          $sum: {
            $map: {
              input: "$attackDetails",
              as: "attack",
              in: { $add: ["$$attack.nkill", "$$attack.nwound"] }
            }
          }
        }
      }
    }
  ]);

  // עדכון כל AttackType עם סך הנפגעים
  for (const attackType of attackTypes) {
    await this.updateOne({ _id: attackType._id }, { numOfCasualties: attackType.numOfCasualties });
  }
};

// יצירת המודל
export const AttackType = model<IAttackType>("AttackType", attackTypeSchema);
