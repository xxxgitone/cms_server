const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RenewSchema = new Schema({
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
  campus: String,
  renewFee: Number,
  createAt: {
    type: Date,
    default: Date.now()
  },
})

const Renew = mongoose.model('Renew', RenewSchema)
module.exports = Renew