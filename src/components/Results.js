import React, { useState, useMemo } from "react"
import { Paper } from '@mui/material'
import MatchUnit from "./MatchUnit";
import { useParams } from "react-router-dom"
import { useData } from "../contexts/DataContext";
import AlertDialogSlide from "./Dialog";
import InlineFeedback from "./InlineFeedback";

export default function Results({ apiData, setApiData, setResultsOptions, resultsOptions }) {
  const { stateHash } = useParams();
  const { getPublicHarmonisations } = useData();
  const [savedError, setSavedError] = useState( null );


  useMemo(() => {
    if (Object.keys(apiData).length === 0 && stateHash) {
      getPublicHarmonisations(stateHash).then((data) => {
        setApiData(data.apiData);
        setResultsOptions(data.resultsOptions);
      }).catch(e => {
        setSavedError(e)
      });
    }
  }, [stateHash, apiData])


  const computedMatches = useMemo(() => {
    // Show items in descending match order
    // Memo will cache
    if (Object.keys(apiData).length) {
      return (apiData.map(instrument => {
        return instrument.questions.map(q => {
          return q.matches.reduce(function (a, e, i) {
            if (Math.abs(e) >= (resultsOptions.threshold / 100) && (resultsOptions.intraInstrument || (i + 1 + q.question_index) > instrument.maxqidx))
              a.push({ qi: q.question_index, mqi: i + 1 + q.question_index, match: e });
            return a;
          }, [])
        }).flat();
      }).flat().sort((a, b) => {
        if (Math.abs(a.match) < Math.abs(b.match)) {
          return 1;
        }
        if (Math.abs(a.match) > Math.abs(b.match)) {
          return -1;
        }
        return 0;
      }));
    }

  }, [resultsOptions, apiData])

  function getQuestion(qidx) {
    return apiData.map((i) => {
      return i.questions
    }).flat().filter((q) => {
      return q.question_index == qidx
    })[0]
  }
  function getInstrument(qidx) {
    return apiData.filter((i) => {
      return i.minqidx <= qidx && i.maxqidx >= qidx
    })[0]
  }
  return (
    <Paper elevation={4} sx={{ display: "flex", flexDirection: "column", width: "100%", padding: "1rem 1rem  0 1rem" }}>
      {(savedError) && <AlertDialogSlide title="No Data!" message={"This harmonisation could not be loaded, if you have followed a sharing link this may have been disabled. Why not make one of your own?"} initialState={true} />}
      <InlineFeedback message="Only the first 500 matches are shown, you may use Export to see them all" severity="warning" state={computedMatches && computedMatches.length >500} />
      <InlineFeedback message="No matches - try lowering your threshold" severity="warning" state={computedMatches && computedMatches.length === 0} />
      {computedMatches && computedMatches.slice(0, 500).map(i => {
        return (
          <MatchUnit
            key={i.mqi + '-' + i.match + '-' + i.qi}
            Q1={getQuestion(i.qi)}
            Q2={getQuestion(i.mqi)}
            I1={getInstrument(i.qi)}
            I2={getInstrument(i.mqi)}
            percentage={Math.round(i.match * 100)}
          />
        );
      })}
    </Paper>
  )
}
