var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'] },
    price: { type: Number, required: [true, 'El precio únitario es necesario'] },
    description: { type: String, required: false },
    available: { type: Boolean, default: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: [true, 'Se necesita indicar una categoría'] },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});


module.exports = mongoose.model('Producto', productSchema);