import React, { useState } from "react"
import { Container, Paper, Box, Slide } from "@mui/material"
import { TransitionGroup } from "react-transition-group";
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Upload from "./Upload"
import Results from "./Results"
import Login from "./Login"
import CssBaseline from '@mui/material/CssBaseline';
import { themeOptions } from '../conf/theme.ts'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import HarmonyAppBar from './AppBar'
import useMediaQuery from '@mui/material/useMediaQuery';
import pattern from '../img/pattern.svg'
import logoWithText from '../img/Logo-04-min.svg'
import ResultsOptions from "./ResultsOptions";
const theme = createTheme(themeOptions);

function App() {
  const [fileInfos, setFileInfos] = useState([]);
  const [apiData, setApiData] = useState({});
  const [resultsOptions, setResultsOptions] = useState({threshold:70, intraInstrument:true});
 
  return (
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
          <AuthProvider>
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
                backgroundImage: `url(${pattern})`,
                backgroundImage: `linear-gradient(-135deg,#0de5b2DD, #2b45edAA), url(${pattern}), linear-gradient(-135deg,#0de5b2, #2b45ed)`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '2rem',
                color: 'white'
              }}
            >

              <img src={logoWithText} />
              <Switch>
                  <Route path="/model/:stateHash?">
                    <ResultsOptions resultsOptions = {resultsOptions} setResultsOptions = {setResultsOptions} />
                  </Route>
                  <Route path="*" >
                  <div>
                <h1>Haromnise Questionnaire Data - with Harmony</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
              </div>
                  </Route>
                </Switch>
              
              <Box sx={{ display: { md: 'block', sm: 'none', xs: 'none' } }} >
                <img src={logoWithText} style={{ visibility: "hidden" }} />
              </Box>
            </Box>
            <HarmonyAppBar></HarmonyAppBar>
            <Slide
              in={true}
              direction="up"

            >
              <Box sx={{ width: { md: '50%', sm: '100%' },maxHeight: {md: "100%"}, paddingTop:{md: "4rem"},  overflow: "auto", padding: useMediaQuery(theme.breakpoints.only('xs')) ? "1rem" : "2rem" }}>
                <Switch>
                  {/* <Route path="/signup" component={Signup} /> */}
                  {/* <Route path="/forgot-password" component={ForgotPassword} /> */}
                  <Route path="/login">
                    <Login />
                  </Route>
                  <Route path="/model/:stateHash?">
                    <Results fileInfos={fileInfos} apiData={apiData} resultsOptions = {resultsOptions} />
                  </Route>
                  <Route path="*" >
                    <Upload fileInfos={fileInfos} setFileInfos={setFileInfos} setApiData={setApiData} />
                  </Route>
                </Switch>
              </Box>
            </Slide>
          </AuthProvider>
        </Router>
      </Container>
    </ThemeProvider>
  )
}

export default App
