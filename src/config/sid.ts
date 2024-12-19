import fs from 'fs';
import mongoose, { Model, Document } from 'mongoose';
import { IYear, Year } from '../models/years';
import { IAttackType, AttackType } from '../models/attackType';
import { ICountry, Country } from '../models/countries';
import { IRegion, Region } from '../models/regions';
import { ICity, City } from '../models/cities';
import { IGang, Gang } from '../models/gangs';
import { Attack } from '../models/attacks';

type GetOrCreateParams<T extends Document> = {
  map: Map<string, mongoose.Types.ObjectId>;
  model: Model<T>;
  key: string;
  createData: Partial<T>;
};

const getOrCreate = async <T extends Document>({
  map,
  model,
  key,
  createData,
}: GetOrCreateParams<T>): Promise<mongoose.Types.ObjectId> => {
  if (!map.has(key)) {
    // המרת Partial<T> ל-FilterQuery<T>
    const filterQuery = createData as mongoose.FilterQuery<T>;

    const existingDoc = await model.findOne(filterQuery).exec();
    if (existingDoc) {
      map.set(key, existingDoc._id as mongoose.Types.ObjectId);
    } else {
      const newDoc = await model.create(createData);
      map.set(key, newDoc._id as mongoose.Types.ObjectId);
    }
  }
  return map.get(key)!;
};

export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    const filePath = './data/globalterrorismdb_0718dist.json';
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const parsedData: any[] = JSON.parse(rawData);

    const yearsMap = new Map<string, mongoose.Types.ObjectId>();
    const attackTypesMap = new Map<string, mongoose.Types.ObjectId>();
    const countriesMap = new Map<string, mongoose.Types.ObjectId>();
    const regionsMap = new Map<string, mongoose.Types.ObjectId>();
    const citiesMap = new Map<string, mongoose.Types.ObjectId>();
    const gangsMap = new Map<string, mongoose.Types.ObjectId>();

    for (const record of parsedData) {
      const yearId = await getOrCreate<any>({
        map: yearsMap,
        model: Year,
        key: record.iyear.toString(),
        createData: { year: record.iyear },
      });

      const attackTypeId = await getOrCreate<any>({
        map: attackTypesMap,
        model: AttackType,
        key: record.attacktype1_txt,
        createData: { name: record.attacktype1_txt },
      });

      const countryId = await getOrCreate<any>({
        map: countriesMap,
        model: Country,
        key: record.country_txt,
        createData: { name: record.country_txt },
      });

      const regionId = await getOrCreate<any>({
        map: regionsMap,
        model: Region,
        key: record.region_txt,
        createData: { name: record.region_txt },
      });

      const cityId = await getOrCreate<any>({
        map: citiesMap,
        model: City,
        key: record.city || 'Unknown',
        createData: { name: record.city || 'Unknown' },
      });

      const gangId = await getOrCreate<any>({
        map: gangsMap,
        model: Gang,
        key: record.gname || 'Unknown',
        createData: { name: record.gname || 'Unknown' },
      });

      const existingAttack = await Attack.findOne({
        iyear: yearId,
        imonth: record.imonth,
        iday: record.iday,
        country_txt: countryId,
        region_txt: regionId,
        city: cityId,
        attacktype1_txt: attackTypeId,
        target1: record.target1,
        gname: gangId,
        latitude: record.latitude,
        longitude: record.longitude,
      }).exec();

      if (!existingAttack) {
        const attack = await Attack.create({
          iyear: yearId,
          imonth: record.imonth,
          iday: record.iday,
          country_txt: countryId,
          region_txt: regionId,
          city: cityId,
          latitude: record.latitude,
          longitude: record.longitude,
          attacktype1_txt: attackTypeId,
          targtype1_txt: record.targtype1_txt,
          target1: record.target1,
          gname: gangId,
          weaptype1_txt: record.weaptype1_txt,
          nkill: record.nkill || 0,
          nwound: record.nwound || 0,
          nperps: record.nperps || null,
          summary: record.summary || null,
        });

        const totalCasualties = record.nkill + record.nwound;

        const attackType = await AttackType.findById(attackTypeId);

        if (attackType) {
        if (attackType.numOfCasualties < totalCasualties) {
        await AttackType.findByIdAndUpdate(
            attackTypeId,
            { $inc: { numOfCasualties: totalCasualties - attackType.numOfCasualties } }
                );
            }
        } else {
        await AttackType.findByIdAndUpdate(
            attackTypeId,
            { $set: { numOfCasualties: totalCasualties } }
        );
        }
        await Promise.all([
          Year.findByIdAndUpdate(yearId, { $addToSet: { attacks: attack._id } }),
          AttackType.findByIdAndUpdate(attackTypeId, { $addToSet: { attacks: attack._id } }),
          Country.findByIdAndUpdate(countryId, { $addToSet: { attacks: attack._id } }),
          Region.findByIdAndUpdate(regionId, { $addToSet: { attacks: attack._id } }),
          City.findByIdAndUpdate(cityId, { $addToSet: { attacks: attack._id } }),
          Gang.findByIdAndUpdate(gangId, { $addToSet: { attacks: attack._id } }),
        ]);
      }
    }

    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
