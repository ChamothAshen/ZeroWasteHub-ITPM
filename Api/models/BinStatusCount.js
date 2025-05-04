import mongoose from 'mongoose';

const binStatusCountSchema = new mongoose.Schema({
    binType: String,
    binSize: String,
    approvedCount: { type: Number, default: 0 },
 
  });

export default mongoose.model("BinStatusCount", binStatusCountSchema);
  