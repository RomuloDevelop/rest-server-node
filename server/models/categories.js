const uniqueValidator= require('mongoose-unique-validator');
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let CategorySchema = new Schema({
    description: {
        type: String,
        unique: true,
        required: [true, 'La descripción es necesaria']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

CategorySchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser unico' 
});

module.exports = mongoose.model('Category', CategorySchema);