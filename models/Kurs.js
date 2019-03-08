const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KursSchema = new Schema({
    
    symbol: {
        type: String,
        required: true
    },
    e_rate: {
        type: Object,
        required: true
    },
    tt_counter: {
        type: Object,
        required: true
    },
    bank_notes: {
        type: Object,
        required: true
    },
    date: {
        type: Date,
        default: Date.now(),
        unique: true
    }

});

module.exports = mongoose.model('kurs', KursSchema);