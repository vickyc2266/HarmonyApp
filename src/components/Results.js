import React, { useState, useMemo } from "react"
import { Paper, Card, Stack, Box, Link, Typography } from '@mui/material'
import MatchUnit from "./MatchUnit";
import { useParams } from "react-router-dom"
import { useData } from "../contexts/DataContext";
import AlertDialogSlide from "./Dialog";
import InlineFeedback from "./InlineFeedback";


import {
  parse,
  test,
} from 'liqe';


export default function Results({ apiData, setApiData, setResultsOptions, resultsOptions, ReactGA, toaster, reportComputedMatches }) {
  const { stateHash } = useParams();
  const { getPublicHarmonisations, reportMisMatch } = useData();
  const [savedError, setSavedError] = useState(null);

  ReactGA.send({ hitType: "pageview", page: "/model", title: "Model" });

  const matchUnitMenuAction = (event) => {
    const action = event.action
    const matchKey = event.q1.question_index + "-" + event.q2.question_index
    var thisApiData = { ...apiData };
    if (action === 'select') {
      if (Object.keys(thisApiData).includes('selectedMatches')) {
        if (thisApiData['selectedMatches'].includes(matchKey)) {
          thisApiData['selectedMatches'] = thisApiData['selectedMatches'].filter((e) => {
            return e !== matchKey
          })
        } else {
          thisApiData['selectedMatches'].push(matchKey);
        }
      } else {
        thisApiData['selectedMatches'] = [matchKey];
      }
    } else {
      if (Object.keys(thisApiData).includes('ignoredMatches')) {
        thisApiData['ignoredMatches'].push(matchKey);
      } else {
        thisApiData['ignoredMatches'] = [matchKey];
      }
    }
    if (action === 'report') {
      toaster.promise(
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

  const safeTest = (query, haystack) => {
    let result = false
    try {
      result = test(query, haystack)
    } catch (e) {
      console.log(e)
    }
    return result
  }



  const selectAll = () => {
    var thisApiData = { ...apiData };
    if (!Object.keys(thisApiData).includes('selectedMatches')) {
      thisApiData['selectedMatches'] = []
    }
    computedMatches.forEach(m => {
      const matchKey = m.qi + "-" + m.mqi;
      if (!thisApiData['selectedMatches'].includes(matchKey)) {
        thisApiData['selectedMatches'].push(matchKey)
      }
    })
    setApiData(thisApiData);

  }
  const computedMatches = useMemo(() => {
    // Show items in descending match order
    // Memo will cache
    var ignoredMatches = []
    if (Object.keys(apiData).includes('ignoredMatches')) {
      ignoredMatches = apiData.ignoredMatches
    }
    var selectedMatches = []
    if (Object.keys(apiData).includes('selectedMatches')) {
      selectedMatches = apiData.selectedMatches
    }
    let cm = [];
    if (Object.keys(apiData).length) {
      let liqeQuery = ""
      try {
        liqeQuery = parse(resultsOptions.searchTerm);
      } catch (e) {
        console.log(e)
      }
      console.log(liqeQuery)
      cm = (apiData.instruments.map(instrument => {
        return instrument.questions.map(q => {
          return q.matches.reduce(function (a, e, i) {
            let mq = getQuestion(i + 1 + q.question_index);
            if (
              (!resultsOptions.onlySelected || selectedMatches.includes(q.question_index + "-" + (i + 1 + q.question_index))) &&
              (resultsOptions.intraInstrument || (i + 1 + q.question_index) > instrument.maxqidx) &&
              Math.abs(e) >= (resultsOptions.threshold[0] / 100) && Math.abs(e) <= (resultsOptions.threshold[1] / 100) &&
              (!liqeQuery || liqeQuery.type === "EmptyExpression" ||
                safeTest(liqeQuery, {
                  question: q.question_text + "_" + mq.question_text,
                  instrument: q.instrument.name + "_" + mq.instrument.name,
                  topic: q.topics_auto.concat(mq.topics_auto)
                })
              )
            )
              if (!ignoredMatches.includes(q.question_index + "-" + (i + 1 + q.question_index))) {
                a.push(
                  {
                    qi: q.question_index,
                    mqi: i + 1 + q.question_index,
                    match: e,
                    selected: selectedMatches.includes(q.question_index + "-" + (i + 1 + q.question_index))
                  }
                );
              }

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
    reportComputedMatches(cm)
    return cm;

  }, [resultsOptions, apiData])

  const getTopics = useMemo(() => {
    if (!computedMatches || computedMatches.length < 1) return [];
    var topics = computedMatches.map(m => {
      return getQuestion(m.qi).topics_auto.concat(getQuestion(m.mqi).topics_auto);
    })
      .flat();
    return [...new Set(topics)];
  }, [computedMatches]);


  function getQuestion(qidx) {
    return apiData.instruments.map((i) => {
      return i.questions
    }).flat().filter((q) => {
      return q.question_index === qidx
    })[0]
  }
  return (
    <Paper elevation={4} sx={{ display: "flex", flexDirection: "column", width: "100%", padding: { xs: "1rem 0.5rem  0 0.5rem", sx: "1rem 1rem  0 1rem", md: "1rem 1rem  0 1rem", lg: "1rem 1rem  0 1rem" } }}>

      {(savedError) && <AlertDialogSlide title="No Data!" message={"This harmonisation could not be loaded, if you have followed a sharing link this may have been disabled. Why not make one of your own?"} initialState={true} />}
      <InlineFeedback message="Only the first 100 matches are shown, you may use Export to see them all" severity="warning" state={computedMatches && computedMatches.length > 100} />
      <InlineFeedback message="No matches - try lowering your threshold" severity="warning" state={computedMatches && computedMatches.length === 0} />
      {computedMatches && <InlineFeedback
        message={
          <>
            Found {computedMatches.length} matches -
            Selected: {computedMatches.filter(m => {
              return m.selected;
            }).length}
            <Link onClick={selectAll} sx={{ cursor: 'pointer', ml: 2 }}>Select all</Link>
          </>
        }
        severity="info" state={computedMatches && computedMatches.length > 0} />
      }
      {getTopics && getTopics.length > 0 &&
        <Card
          variant="outlined"
          sx={{
            display: "flex",
            width: "100%",
            height: { xs: "10rem", sm: "8rem" },
            padding: "0.5rem",
            margin: "0 0 1rem 0",
            justifyContent: "space-between",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Stack
            direction={"row"}
            spacing={2}
            sx={{
              height: "100%",
              width: "100%",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <img
              style={{ height: "4rem", width: "unset" }}
              src={require("../img/sitelogo.png")}
            />

            <Box
              sx={{
                display: "flex",
                height: "100%",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="caption">
                Research topics from{" "}
                <Link
                  href="https://www.cataloguementalhealth.ac.uk"
                  target="_blank"
                  color="inherit"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  Catalogue Mental Health
                </Link>
              </Typography>
              <Typography variant="body1">
                {getTopics.sort().join(', ')}
              </Typography>

              <Typography variant="caption">
                <Link
                  href={
                    "https://www.cataloguementalhealth.ac.uk/?content=search&query=Topic:" +
                    getTopics
                      .sort()
                      .join(" Topic:")
                  }
                  target="_blank"
                  color="inherit"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  Search for studies exploring these topics
                </Link>
              </Typography>
            </Box>
          </Stack>
        </Card>
      }
      {computedMatches && computedMatches.slice(0, 100).map(i => {
        return (
          (!i.ignore) &&
          <MatchUnit
            key={i.mqi + '-' + i.match + '-' + i.qi}
            Q1={getQuestion(i.qi)}
            Q2={getQuestion(i.mqi)}
            percentage={Math.round(i.match * 100)}
            selected={i.selected}
            matchUnitMenuAction={matchUnitMenuAction}
          />

        );
      })}
    </Paper>
  )
}
