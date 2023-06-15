import React, { useEffect, useState } from "react"
import { Question, Instrument } from "../utilities/types"
import { Paper, Slider, Switch, FormGroup, Typography, Stack, ListItem} from '@mui/material'
import MatchUnit from "./matchUnit";
//import gadEnPt from "../utilities/testPosts"



export default function ResultsOptions({ resultsOptions, setResultsOptions }) {
  const [threshold, setThreshold] = useState(resultsOptions.threshold);

  return (
    <Paper elevation={4} sx={{ display: "flex", flexDirection: "column", width: "50%", margin:"auto", padding: "1rem" }}>
      <h3>Options</h3>
      <Stack>
      <Stack direction="row" >
      <Typography id="withinInstruments" gutterBottom>
        Show within-instrument matches 
      </Typography>
      <Switch value={resultsOptions.intraInstrument} />
      </Stack>
        <div><Typography id="withinInstruments" gutterBottom>
        Match Threshold 
      </Typography></div>
        <Slider 
        value={threshold} 
        valueLabelDisplay="auto" 
        onChange={(e, value) => {setThreshold(value)}}
        onChangeCommitted={(e, value) => {let thisOptions = {...resultsOptions}; thisOptions.threshold = isNaN(value)?70:value; setResultsOptions(thisOptions)}}
        />

        </Stack>
      

    </Paper>
  )
}
