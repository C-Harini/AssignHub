const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: '', maxlength: 5000 },
    type: { type: String, enum: ['pdf', 'link', 'richtext'], default: 'richtext' },
    externalLink: { type: String, default: '' },
    attachmentPath: { type: String, default: '' }, // server-side path for admin-uploaded PDF
    attachmentName: { type: String, default: '' },
    deadline: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

assignmentSchema.index({ deadline: 1 });
assignmentSchema.index({ title: 'text', description: 'text' });

assignmentSchema.methods.toJSONSafe = function () {
  return {
    id: this._id.toString(),
    title: this.title,
    description: this.description,
    type: this.type,
    externalLink: this.externalLink,
    attachmentName: this.attachmentName,
    hasAttachment: !!this.attachmentPath,
    deadline: this.deadline,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model('Assignment', assignmentSchema);
