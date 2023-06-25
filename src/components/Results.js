import React, { useEffect, useState } from "react"
import { Question, Instrument } from "../utilities/types"
import { Paper } from '@mui/material'
import MatchUnit from "./MatchUnit";
//import gadEnPt from "../utilities/testPosts"



export default function Results({ fileInfos, apiData, resultsOptions }) {
  const [questions, setQuestions] = useState([])
  
  useEffect(() => {
    if (fileInfos && fileInfos.length) {
      let questions = [];
      fileInfos.forEach((i) => {
        let instrument = new Instrument(i.instrument_name, i.language, i.instrument_id, i.grouping, );
        i.questions.forEach((q, index) => {
          let question = new Question(index, q.question_text, q.question_no, q.question_intro, q.options);
          question.setInstrument(instrument);
          questions.push(question);
        });
      })
      setQuestions(questions);
    }
  }, [fileInfos]);


  return (
    <Paper elevation={4} sx={{ display: "flex", flexDirection: "column", width: "100%", padding: "1rem" }}>
      {/* This assumes the instrument order is the same as the match order */}
      {apiData && questions.length && apiData.matches && apiData.matches.map((matches, qi) => {
        let twoWays = [];
        // extract the indexes of questions over current thrshold
        matches.reduce(function (a, e, i) {
          if (Math.abs(e) >= (resultsOptions.threshold/100))
            a.push({ mqi: i, match: e });
          return a;
        }, []).forEach((i) => {
          if (i.mqi > qi && (resultsOptions.intraInstrument || questions[qi].instrument !== questions[i.mqi].instrument )) 
            twoWays.push(<MatchUnit key={i.mqi + '-' + i.match +'-' + qi } Q1={questions[qi]} Q2={questions[i.mqi]} percentage={Math.round(i.match * 100)} />)
        });
        return twoWays;
      })}
    </Paper>
  )
}
