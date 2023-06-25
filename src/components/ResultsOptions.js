import React, {  useState } from "react"
import { Divider,Card, Slider, Switch,  Typography, Stack} from '@mui/material'


export default function ResultsOptions({ resultsOptions, setResultsOptions }) {
  const [threshold, setThreshold] = useState(resultsOptions.threshold);
 
  return (
    <Card  sx={{ display: "flex", flexDirection: "column", width: "75%", margin:"auto", padding: "1rem" }}>
      <h2 style={{marginTop:0}}>Options</h2>
      <Stack>
        <div><Typography id="Threshold">
        Match Threshold 
      </Typography></div>
        <Slider 
        value={threshold}
        min={30} 
        valueLabelDisplay="auto" 
        onChange={(e, value) => {setThreshold(value)}}
        onChangeCommitted={(e, value) => {let thisOptions = {...resultsOptions}; thisOptions.threshold = isNaN(value)?70:value; setResultsOptions(thisOptions)}}
        />
        <Divider sx={{mt:1, mb:1}}/>
        <Stack direction="row" sx={{width:"100%", alignItems:"center", justifyContent:"space-between"}} >
      <Typography id="withinInstruments">
        Show within-instrument matches 
      </Typography>
      <Switch 
        value={resultsOptions.intraInstrument?'on':'off'}
        onChange={(e, value) => {
          let thisOptions = {...resultsOptions};
          thisOptions.intraInstrument = value;
          setResultsOptions(thisOptions);
          console.log(thisOptions);}}
        />
      </Stack>
      
        </Stack>
    </Card>
  )
}
