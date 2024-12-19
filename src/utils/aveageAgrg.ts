import { Region } from '../models/regions';

export const updateAverageCasualtiesPerRegion = async () => {
  try {
    const regions = await Region.aggregate([
      {
        $lookup: {
          from: 'attacks', // name of the collection for attacks
          localField: 'attacks',
          foreignField: '_id',
          as: 'attacksDetails',
        },
      },
      {
        $addFields: {
          totalCasualties: {
            $sum: {
              $map: {
                input: '$attacksDetails',
                as: 'attack',
                in: { $add: ['$$attack.nkill', '$$attack.nwound'] },
              },
            },
          },
          attackCount: {
            $size: '$attacksDetails',
          },
        },
      },
      {
        $project: {
          name: 1,
          AverageCasualtiesPerAttack: {
            $cond: {
              if: { $eq: ['$attackCount', 0] },
              then: 0,
              else: { $divide: ['$totalCasualties', '$attackCount'] },
            },
          },
        },
      },
    ]);

    for (const region of regions) {
      await Region.findByIdAndUpdate(region._id, {
        AverageCasualtiesPerAttack: region.AverageCasualtiesPerAttack,
      });
    }
  } catch (error) {
    console.error('Error updating average casualties per region:', error);
  }
};
