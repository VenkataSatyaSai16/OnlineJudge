const mongoose = require('mongoose');

//Used in ProblemsPage to display onnly questionId , name and difficulty
const questionSchema = new mongoose.Schema({
    questionId :{
        type: String,
        required: [true, "Question ID is required"],
        unique: true,
        trim: true
    },
    question :{
        type: String,
        required: [true, "Question text is required"],
        trim: true ,
    },
    difficultyLevel:{
        type: String,
        required: [true, "Difficulty level is required"],
        enum: ["Easy", "Medium", "Hard"]
    },
    questionDesc :{
        type: String,
        required: [true, "Question text is required"],
        trim: true ,
    },
    sampleInput:{
        type: String,
        required: [true, "Sample input is required"],
        trim: true
    },
    sampleOutput:{
        type: String, 
        required: [true, "Sample output is required"],
        trim: true
    },
    topics:{
        type: [String],
        required: [true, "At least one topic is required"],
        validate: {
            validator: function(value) {
                return value.length > 0; 
            },
            message: "At least one topic is required"
        }
    },
}, {
    timestamps: true

});

const Questions = mongoose.model('Questions', questionSchema);

module.exports = Questions;

