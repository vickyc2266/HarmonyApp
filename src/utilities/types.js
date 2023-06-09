
function Question(text, num="", intro="",  instrument = null) {
    this.text = text;
    this.instrument = instrument;
    this.num = num;
    this.intro = intro;
    this.setInstrument = (instrument) => {
        this.instrument = instrument;
        this.instrument.addQuestion(this);
    }
}
function Instrument(name, language="en", id = "",  questions = []) {
    this.name = name;
    this.language = language;
    this.id = id;
    this.questions = questions;
    this.addQuestion = (question) =>{
        if(this.questions.indexOf(question) ==-1) {
            this.questions.push(question);
        }
    }
}

export {Question, Instrument};