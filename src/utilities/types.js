
function Question(descriptor = {}) {
    for (var k in descriptor) this[k] = descriptor[k];

}
function Instrument(name, language = "en", id = "", grouping = "", questions = []) {
    this.name = name;
    this.language = language;
    this.id = id;
    this.grouping = grouping;
    this.questions = questions;
    this.minqidx = 0;
    this.maxqidx = 0;
    this.addQuestion = (question) => {
        if (this.questions.indexOf(question) === -1) {
            this.questions.push(question);
            if (this.minqidx > question.question_index) this.minqidx = question.question_index
            if (this.maxqidx < question.question_index) this.maxqidx = question.question_index
        }
    }
}

export { Question, Instrument };