import mongoose, { Schema, model } from "mongoose";

const playerSchema = new Schema({
    date: { type: Date, default: Date.now },
    name: { type: String, required: true },
    score1: { type: Number, default: 0 },
    score2: { type: Number, default: 0 },
    score3: { type: Number, default: 0 },
    score4: { type: Number, default: 0 },
    handicap: { type: Number, default: 0 },
    guest: { type: Boolean, default: false },
    team: { type: Boolean, default: true }, // true : up / false : down
})

const Players = mongoose.models.Players || model('Players', playerSchema)

export default Players