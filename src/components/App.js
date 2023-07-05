import React, { useState, useEffect, useMemo } from "react"
import { Container, Box, Slide, useMediaQuery } from "@mui/material"
import { HashRouter as Router, Switch, Route } from "react-router-dom"
import Upload from "./Upload"
import Results from "./Results"
import Login from "./Login"
import CssBaseline from '@mui/material/CssBaseline';
import { getDesignTokens, getThemedComponents } from '../conf/theme.ts'
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles'
import HarmonyAppBar from './AppBar'
import pattern from '../img/pattern.svg'
import logoWithText from '../img/Logo-04-min.svg'
import ResultsOptions from "./ResultsOptions";
import { deepmerge } from '@mui/utils';
import { ColorModeContext } from "../contexts/ColorModeContext"
import postData from "../utilities/postData"
import { useData } from "../contexts/DataContext"
import {utils as XLSXutils, writeFile as XLSXwriteFile} from "xlsx";

function App() {
  const [fileInfos, setFileInfos] = useState([]);
  const [existingInstruments, setExistingInstruments] = useState([]);
  const [apiData, setApiData] = useState({});
  const [resultsOptions, setResultsOptions] = useState({ threshold: 70, intraInstrument: true });
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState();
  const { storeHarmonisation } = useData();
  

  useEffect(() => {
    setMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  useEffect(() => {
    postData("https://api.harmonydata.org/text/examples").then((data) => {
      setExistingInstruments(data)
      console.log(data)
    }).catch(e => {
      console.log(e)
    });
  }, [])

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  const getQuestion = (qidx) => {
    return apiData.map((i) =>{
      return i.questions
    }).flat().filter((q) =>{
      return q.question_index == qidx
    })[0]
  }

  const getInstrument = (qidx) => {
    return apiData.filter((i) =>{
      return i.minqidx<=qidx && i.maxqidx >=qidx
    })[0]
  }
  const makePublicShareLink = () => {
    let h = {}
    h.apiData = JSON.parse(JSON.stringify(apiData));
    console.log(h.apiData)
    h.resultsOptions = resultsOptions;
    h.public = true;
    h.created = new Date();
    return new Promise((resolve, reject) => {
      storeHarmonisation(h).then((doc) => {
        console.log(doc)
        resolve(window.location.origin + "/#/model/" + doc.id);
      }).catch(e => {
        console.log(e)
        reject("Could not create share link")
      })
    })
  }

  const saveToMyHarmony = () => {
    let h = {}
    h.apiData = JSON.parse(JSON.stringify(apiData));
    h.resultsOptions = resultsOptions;
    h.public = false;
    h.created = new Date();
    return new Promise((resolve, reject) => {
      storeHarmonisation(h).then((docRef) => {
        resolve(window.location.origin + "/match/" + docRef);
      }).catch(e => {
        console.log(e)
        reject("Could not create share link")
      })
    })
}

 const downloadExcel = () => {
    const exportedData = apiData.map(instrument=>{
      return instrument.questions.map(q=>{
        return q.matches.reduce(function (a, e, i) {
          if (Math.abs(e) >= (resultsOptions.threshold/100) && 
              (resultsOptions.intraInstrument || (i + 1 + q.question_index) > instrument.maxqidx )) {
            var mq = getQuestion(i + 1 + q.question_index);
            var mi = getInstrument(i + 1 +q.question_index);
            a.push(
              {
                instrument1: instrument.name,
                question1_no: q.question_no,
                question1_text: q.question_text,
                question1_topics: q.topics_auto.toString(),
                instrument2: mi.name,
                question2_no: mq.question_no,
                question2_text: mq.question_text,
                question2_topics: mq.topics_auto.toString(),
                match: e 
              });
            }
          return a;
          }
        , [])
      }).flat();
    }).flat().sort((a,b) =>{
      if ( Math.abs(a.match) < Math.abs(b.match) ){
        return 1;
      }
      if ( Math.abs(a.match) > Math.abs(b.match) ){
        return -1;
      }
      return 0;
    });
    const worksheet = XLSXutils.json_to_sheet(exportedData);
    const workbook = XLSXutils.book_new();
    XLSXutils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSXwriteFile(workbook, "Harmony.xlsx");
  };

  let theme = useMemo(
    () =>
      createTheme(deepmerge(getDesignTokens(mode), getThemedComponents(mode))),
    [mode]
  );

  theme = responsiveFontSizes(theme);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container disableGutters={true}
          //
          sx={{
            display: { md: 'flex', sm: 'block' },
            flexDirection: useMediaQuery(theme.breakpoints.down('md')) ? 'column' : 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100%',
            maxWidth: '100%!important'
          }}
        >
          <Router>
            {/* Side bar for wide screens - narrow screens at top of screen and only on upload page*/}
            <Box
              sx={{
                display: 'flex',
                boxSizing: 'border-box',
                width: { md: '50%', sm: '100%' },
                top: 0,
                marginLeft: 0,
                marginRight: "auto",
                height: { md: '100%', sm: 'unset' },
                background: 'linear-gradient(-135deg,#0de5b2, #2b45ed)',
                backgroundImage: `linear-gradient(-135deg,#0de5b2DD, #2b45edAA), url(${pattern}), linear-gradient(-135deg,#0de5b2, #2b45ed)`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '2rem',
                color: 'white'
              }}
            >

              <img src={logoWithText} alt="Harmony Logo" />
              <Switch>
                <Route path="/model/:stateHash?">
                  <ResultsOptions resultsOptions={resultsOptions} setResultsOptions={setResultsOptions} makePublicShareLink={makePublicShareLink} saveToMyHarmony={saveToMyHarmony} downloadExcel={downloadExcel} />
                </Route>
                <Route path="*" >
                  <div>
                    <h1 style={{ color: "white" }}>Harmonise questionnaire data - with Harmony</h1>
                    <p>Harmony is a tool for retrospective harmonisation of questionnaire data.</p>
                    <p>If you want to compare data from different surveys, such as GAD-7 and PHQ-9,
                      Harmony can identify which questions match.</p>
                    <p>
                      <a href="https://harmonydata.org/frequently-asked-questions">FAQs</a> - <a href="https://harmonydata.org/privacy-policy">Privacy policy</a></p>
                  </div>
                </Route>
              </Switch>

              <Box sx={{ display: { md: 'block', sm: 'none', xs: 'none' } }} >
                <img src={logoWithText} style={{ visibility: "hidden" }} alt="Harmony Logo" />
              </Box>
            </Box>
            <HarmonyAppBar></HarmonyAppBar>
            <Slide
              in={true}
              direction="up"

            >
              <Box sx={{ width: { md: '50%', sm: '100%' }, maxHeight: { md: "100%" }, paddingTop: { md: "4rem" }, overflow: "auto", padding: useMediaQuery(theme.breakpoints.only('xs')) ? "1rem" : "2rem" }}>
                <Switch>
                  {/* <Route path="/signup" component={Signup} /> */}
                  {/* <Route path="/forgot-password" component={ForgotPassword} /> */}
                  <Route path="/login">
                    <Login />
                  </Route>
                  <Route path="/model/:stateHash?">
                    <Results fileInfos={fileInfos} apiData={apiData} setApiData={setApiData} setResultsOptions={setResultsOptions} resultsOptions={resultsOptions} />
                  </Route>
                  <Route path="*" >
                    <Upload fileInfos={fileInfos} setFileInfos={setFileInfos} setApiData={setApiData} existingInstruments={existingInstruments} />
                  </Route>
                </Switch>
              </Box>
            </Slide>
          </Router>
        </Container>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App
