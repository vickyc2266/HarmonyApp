import React, {  useState } from "react"
import { Card, Slider, Switch,  Typography, Stack} from '@mui/material'


export default function ResultsOptions({ resultsOptions, setResultsOptions }) {
  const [threshold, setThreshold] = useState(resultsOptions.threshold);

  return (
    <Card  sx={{ display: "flex", flexDirection: "column", width: "50%", margin:"auto", padding: "1rem" }}>
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
        min={30} 
        valueLabelDisplay="auto" 
        onChange={(e, value) => {setThreshold(value)}}
        onChangeCommitted={(e, value) => {let thisOptions = {...resultsOptions}; thisOptions.threshold = isNaN(value)?70:value; setResultsOptions(thisOptions)}}
        />

        </Stack>
    </Card>
  )
}
