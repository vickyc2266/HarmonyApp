import React, { useState, useMemo } from "react"
import { Paper } from '@mui/material'
import MatchUnit from "./MatchUnit";
import { useParams } from "react-router-dom"
import { useData } from "../contexts/DataContext";
import AlertDialogSlide from "./Dialog";
import InlineFeedback from "./InlineFeedback";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Results({ apiData, setApiData, setResultsOptions, resultsOptions, ReactGA }) {
  const { stateHash } = useParams();
  const { getPublicHarmonisations, reportMisMatch } = useData();
  const [savedError, setSavedError] = useState(null);
  // const SearchString = require("search-string")

  ReactGA.send({ hitType: "pageview", page: "/model", title: "Model" });

  const matchUnitMenuAction = (event) => {
    const action = event.action
    var thisApiData = { ...apiData };
    if (Object.keys(thisApiData).includes('ignoredMatches')) {
      thisApiData['ignoredMatches'].push(event);
    } else {
      thisApiData['ignoredMatches'] = [event];
    }

    console.log(thisApiData)
    if (action == 'report') {
      toast.promise(
        new Promise((resolve, reject) => { reportMisMatch(event).then(ref => resolve(ref)).catch(e => reject(e)) }),
        {
          pending: 'Reporting mismatch',
          success: 'Reported',
          error: 'Failed to report'
        }
      ).then(_ => { setApiData(thisApiData) })
    } else {
      setApiData(thisApiData);
    }
  }

  useMemo(() => {
    if (Object.keys(apiData).length === 0 && stateHash) {
      getPublicHarmonisations(stateHash).then((data) => {
        if (Array.isArray(data.apiData)) {
          setApiData({ instruments: data.apiData });
        } else {
          setApiData(data.apiData);
        }
        setResultsOptions(data.resultsOptions);
      }).catch(e => {
        setSavedError(e)
      });
    }
  }, [stateHash, apiData])


  const computedMatches = useMemo(() => {
    // Show items in descending match order
    // Memo will cache
    var ignoredMatches = []
    if (Object.keys(apiData).includes('ignoredMatches')) {
      ignoredMatches = apiData.ignoredMatches
      ignoredMatches = ignoredMatches.map(im => {
        return im.q1.question_index + "-" + im.q2.question_index
      })
    }

    if (Object.keys(apiData).length) {
      return (apiData.instruments.map(instrument => {
        return instrument.questions.map(q => {
          return q.matches.reduce(function (a, e, i) {
            if (
              Math.abs(e) >= (resultsOptions.threshold[0] / 100) && Math.abs(e) <= (resultsOptions.threshold[1] / 100) &&
              (resultsOptions.intraInstrument || (i + 1 + q.question_index) > instrument.maxqidx) &&
              (!resultsOptions.searchTerm || (q.question_text.concat(q.topics_auto).toLowerCase().includes(resultsOptions.searchTerm.toLowerCase()) || getQuestion(i + 1 + q.question_index).question_text.concat(getQuestion(i + 1 + q.question_index).topics_auto).toLowerCase().includes(resultsOptions.searchTerm))))
              a.push({ qi: q.question_index, mqi: i + 1 + q.question_index, match: e, ignore: ignoredMatches.includes(q.question_index + "-" + (i + 1 + q.question_index)) });
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
    return apiData.instruments.map((i) => {
      return i.questions
    }).flat().filter((q) => {
      return q.question_index == qidx
    })[0]
  }
  return (
    <Paper elevation={4} sx={{ display: "flex", flexDirection: "column", width: "100%", padding: { xs: "1rem 0.5rem  0 0.5rem", sx: "1rem 1rem  0 1rem", md: "1rem 1rem  0 1rem", lg: "1rem 1rem  0 1rem" } }}>
      <ToastContainer />
      {(savedError) && <AlertDialogSlide title="No Data!" message={"This harmonisation could not be loaded, if you have followed a sharing link this may have been disabled. Why not make one of your own?"} initialState={true} />}
      <InlineFeedback message="Only the first 500 matches are shown, you may use Export to see them all" severity="warning" state={computedMatches && computedMatches.length > 500} />
      <InlineFeedback message="No matches - try lowering your threshold" severity="warning" state={computedMatches && computedMatches.length === 0} />
      <InlineFeedback message={"Found " + computedMatches.length + " matches"} severity="info" state={computedMatches && computedMatches.length > 0 && computedMatches.length < 501} />
      {computedMatches && computedMatches.slice(0, 500).map(i => {
        return (
          (!i.ignore) &&
          <MatchUnit
            key={i.mqi + '-' + i.match + '-' + i.qi}
            Q1={getQuestion(i.qi)}
            Q2={getQuestion(i.mqi)}
            percentage={Math.round(i.match * 100)}
            matchUnitMenuAction={matchUnitMenuAction}
          />

        );
      })}
    </Paper>
  )
}
