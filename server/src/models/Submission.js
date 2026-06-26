const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true, index: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    filePath: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, default: 0 },
    mimeType: { type: String, default: '' },
    remarks: { type: String, default: '', maxlength: 1000 },
    submittedAt: { type: Date, default: Date.now },
    late: { type: Boolean, default: false },
  },
  { timestamps: true }
);

submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

submissionSchema.methods.toJSONSafe = function () {
  return {
    id: this._id.toString(),
    assignmentId: this.assignment?._id?.toString() || this.assignment?.toString(),
    studentId: this.student?._id?.toString() || this.student?.toString(),
    fileName: this.fileName,
    fileSize: this.fileSize,
    mimeType: this.mimeType,
    remarks: this.remarks,
    submittedAt: this.submittedAt,
    late: this.late,
  };
};

module.exports = mongoose.model('Submission', submissionSchema);
