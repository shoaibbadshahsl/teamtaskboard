import { Schema, model } from 'mongoose';

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Done'],
    default: 'Pending', 
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

export const Task = model('Task', taskSchema);
