/**
 *Created by mayomi.ayandiran on 1/30/18
 */

const QuizModel = require('../models/quiz');
const OptionModel = require('../models/option');
const Helper = require('../helper');
const EXCLUDE_OUTPUT = '-updatedAt -createdAt -__v';

class Quiz {


    createQuizQuestion (req, res) {
        const question = req.body.question;
        const newQuiz = QuizModel({
            question: question
        });

        return newQuiz.save().then((response) => {
            return Helper.SuccessMessage(response, res);
        }).catch((error) => {
            return Helper.errorMessage(error, res);
        })

    }

    createQuestionOptions (req, res) {
        const quizId = req.params.quiz_id;
        const option = req.body.option;
        const isCorrect = req.body.is_correct;

        const addOptions = OptionModel({
            option: option,
            quiz_id: quizId,
            is_correct: isCorrect
        });

        return addOptions.save().then((response => {
            QuizModel.findById(quizId).then((quizRes) => {
                quizRes.options.push(addOptions);
                quizRes.save();
            });
            Helper.SuccessMessage(response, res);
        })).catch((error) => {
            Helper.errorMessage(error, res);
        })
    }

    getQuestionAndOptions (req, res) {
        const quizId = req.params.quiz_id;

        QuizModel.findById(quizId, EXCLUDE_OUTPUT)
            .populate('options', EXCLUDE_OUTPUT)
            .then((response) => {
                return res.json({
                    status: true,
                    data: response
                })
        });
    }

     getAllQuestionsAndOptions (req, res) {

        QuizModel.find({}, EXCLUDE_OUTPUT)
            .populate('options', EXCLUDE_OUTPUT)
            .then((response) => {
                return res.json({
                    status: true,
                    data: response
                })


        })

    }

}

module.exports = new Quiz;
