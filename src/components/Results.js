import React, { useEffect, useState } from "react"
import { Question, Instrument } from "../utilities/types"
import { Paper } from '@mui/material'
import MatchUnit from "./matchUnit";
//import gadEnPt from "../utilities/testPosts"



export default function Results({ fileInfos, apiData }) {
  const [instruments, setInstruments] = useState([])
  const [questions, setQuestions] = useState([])
  const currentThreshold = 0.7;

  useEffect(() => {
    if (fileInfos && fileInfos.length) {
      let instruments = [];
      let questions = [];
      fileInfos.map((i) => {
        let instrument = new Instrument(i.instrument_name, i.language, i.instrument_id,);
        i.questions.map((q, index) => {
          let question = new Question(index, q.question_text, q.question_no, q.question_intro, q.options);
          question.setInstrument(instrument);
          questions.push(question);
        });
        instruments.push(instrument);
      });
      setInstruments(instruments);
      setQuestions(questions);
    }
  }, [fileInfos, apiData]);


  return (
    <Paper elevation={4} sx={{ display: "flex", flexDirection: "column", width: "100%", padding: "1rem" }}>
      {/* This assumes the instrument order is the same as the match order */}
      {apiData && questions.length && apiData.matches && apiData.matches.map((matches, qi) => {
        let twoWays = [];
        // extract the indexes of questions over current thrshold
        matches.reduce(function (a, e, i) {
          if (Math.abs(e) > currentThreshold)
            a.push({ mqi: i, match: e });
          return a;
        }, []).map((i) => {
          if (i.mqi > qi) twoWays.push(<MatchUnit Q1={questions[qi]} Q2={questions[i.mqi]} percentage={Math.round(i.match * 100)} />)
        });
        return twoWays;
      })}
    </Paper>
  )
}
