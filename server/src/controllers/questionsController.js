const { Exam, Question, AvaliableAnswer } = require("../models");


const createQuestionPost = async (req, res) => {
    try {
        const exam = await Exam.findOne({ where: { uuid: req.params.uuid } })

        const question = await Question.create({ 
            question: req.body.question,
            type: req.body.type,
            value: req.body.value,
            examId: exam.id
        });

        req.body.avaliableAnswers.forEach(async avaliableAnswer => {
            const isCorrect = (avaliableAnswer.isCorrect === "true");
            await AvaliableAnswer.create({
                answer: avaliableAnswer.answer,
                isCorrect: isCorrect,
                questionId: question.id
            });
        });

        exam.pointsToGet = exam.pointsToGet + Number(req.body.value);
        await exam.save();

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Something went wrong' });
    };

    res.status(200).json("[SERVER] question created");
};


const deleteQuestionPost = async (req, res) => {
    try {
        const question = await Question.findOne({ where: { uuid: req.params.uuid } });
        const exam = await Exam.findOne({ where: { id: question.examId } })

        exam.pointsToGet = exam.pointsToGet - Number(question.value);

        await exam.save();
        await question.destroy();

        return res.status(200).json({ message: 'Question has been successfully deleted' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Something went wrong' });
    };
};


module.exports = {
    createQuestionPost,
    deleteQuestionPost
};
