import { model, Schema } from "mongoose";

interface IAttack {
    iyear: number;
    imonth: number;
    iday: number;
    country: string;
    region: string;
    city: string;
    latitude: number;
    longitude: number;
    attacktype1: string;
    targtype1: string;
    target1: string;
    gname: string;
    weaptype1: string;
    weapsubtype1: string;
    nkill: number;
    nwound: number;
    nperps: number;
    summary: string;
}

export const attackSchema = new Schema({
    iyear: {
        type: Number,
        required: true
    },
    imonth: {
        type: Number,
        required: true
    },
    iday: {
        type: Number,
        required: true
    },
    country_txt: {
        ref: "countries",
        type: Schema.Types.ObjectId
    },
    region_txt: {
        ref: "regions",
        type: Schema.Types.ObjectId
    },
    city: {
        ref: "cities",
        type: Schema.Types.ObjectId
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    attacktype1_txt: {
        ref: "attackType",
        type: Schema.Types.ObjectId
    },
    targtype1_txt: {
        type: String,
        required: true
    },
    target1: {
        type: String,
        required: true
    },
    gname: {
        ref: "gangs",
        type: Schema.Types.ObjectId
    },
    weaptype1_txt: {
        type: String,
        required: true
    },

    nkill: {
        type: Number,
        default: 0
    },
    nwound: {
        type: Number,
        default: 0
    },
    nperps: {
        type: Number,
        default: null
    },
    summary: {
        type: String,
        default: null
    }
});

export const Attack = model<IAttack>("Attacks", attackSchema);
