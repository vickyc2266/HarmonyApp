import React, { Suspense } from "react"
import { Container, Paper, Box } from "@mui/material"
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Upload from "./Upload"
import Results from "./Results"
import Login from "./Login"
import PrivateRoute from "./PrivateRoute"
// import ForgotPassword from "./ForgotPassword"
import CssBaseline from '@mui/material/CssBaseline';
import {themeOptions} from '../conf/theme.ts'
import {createTheme, ThemeProvider } from '@mui/material/styles'
import UniAppBar from './AppBar'
import useMediaQuery from '@mui/material/useMediaQuery';
import pattern from '../img/pattern.svg'
const theme = createTheme(themeOptions);

function App() {
  return (
    <ThemeProvider theme={theme}>
            <CssBaseline />
    <Container disableGutters={true}
    //useMediaQuery(theme.breakpoints.only('xs'))
    sx = {{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
        maxWidth:'100%!important'
      }}
    >
        <Router>
          <AuthProvider>
         
          <Box
                  sx={{
                   display: { xs: 'none', sm: 'none' , md: 'flex' },
                   boxSizing: 'border-box', 
                   width: '50%' ,
                   marginLeft:0,
                   marginRight:"auto",
                   height:'100%',
                   background: 'linear-gradient(#0de5b2, #2b45ed)',
                   backgroundImage: `url(${pattern})`,
                   backgroundImage: `url(${pattern}), linear-gradient(-135deg,#0de5b2, #2b45ed)`,
                   backgroundSize: "contain",
                   backgroundPosition: "bottom right",
                   backgroundRepeat: "no-repeat",
                   flexDirection: 'column',
                   justifyContent: 'center',
                   padding:'2rem',
                   color: 'white'
                  }}
                  open={true}
                >
                  <h1>Haromnise Questionnaire Data - with Harmony</h1>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
                </Box>
                <UniAppBar></UniAppBar>
             <Switch>
              <PrivateRoute exact path="/" component={Upload} />
              <PrivateRoute path="/results" component={Results} />
              {/* <Route path="/signup" component={Signup} /> */}
              <Route path="/login" component={Login} />
              {/* <Route path="/forgot-password" component={ForgotPassword} /> */}
            </Switch>
          </AuthProvider>
        </Router>
    </Container>
    </ThemeProvider>
  )
}

export default App
