import mongoose from "mongoose";

export const aggregateIncidentTrends = async () => {
  try {
    const pipeline = [
      {
        $lookup: {
          from: "years", // שם הקולקשן של השנים
          localField: "iyear",
          foreignField: "_id", // התאמה לפי ObjectId
          as: "yearDetails",
        },
      },
      {
        $unwind: "$yearDetails",
      },
      {
        $group: {
          _id: "$yearDetails.year", 
          months: {
            $push: {
              month: "$imonth",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id",
          numOfAttacks: {
            $map: {
              input: Array.from({ length: 12 }, (_, i) => i + 1),
              as: "month",
              in: {
                month: "$$month",
                numOfAttacks: {
                  $size: {
                    $filter: {
                      input: "$months",
                      as: "attackMonth",
                      cond: { $eq: ["$$attackMonth.month", "$$month"] },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ];

    const result = await mongoose.connection.collection("attacks").aggregate(pipeline).toArray();

    for (const yearData of result) {
      await mongoose.connection.collection("years").updateOne(
        { year: yearData.year },
        { $set: { numOfAttacks: yearData.numOfAttacks } }
      );
    }

  } catch (error) {
    console.error("Error in aggregation:", error);
  }
};
