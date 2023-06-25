
function Question(question_index, question_text, question_no="", question_intro="", options=[], instrument = null) {
    this.index = question_index
    this.text = question_text;
    this.instrument = instrument;
    this.no = question_no;
    this.intro = question_intro;
    this.options = options;
    this.setInstrument = (instrument) => {
        this.instrument = instrument;
        this.instrument.addQuestion(this);
    }
}
function Instrument(name, language="en", id = "", grouping="",  questions = []) {
    this.name = name;
    this.language = language;
    this.id = id;
    this.grouping = grouping;
    this.questions = questions;
    this.addQuestion = (question) =>{
        if(this.questions.indexOf(question) === -1) {
            this.questions.push(question);
        }
    }
}

export {Question, Instrument};