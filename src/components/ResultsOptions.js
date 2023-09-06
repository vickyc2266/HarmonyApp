import React, { useEffect, useState } from "react"
import { Divider, Card, Slider, Switch, Typography, Stack, Button, TextField } from '@mui/material'
import { ReactComponent as xlsxSVG } from "../img/file-excel-solid.svg"
import DropdownShareButton from "./DropdownShareButton";
import SvgIcon from '@mui/material/SvgIcon';
import { useAuth } from "../contexts/AuthContext"


export default function ResultsOptions({ resultsOptions, setResultsOptions, makePublicShareLink, saveToMyHarmony, downloadExcel, ReactGA }) {
  const [threshold, setThreshold] = useState(resultsOptions.threshold);
  const { currentUser } = useAuth();

  useEffect(() => {
    setThreshold(resultsOptions.threshold);
  }, [resultsOptions])

  return (
    <Card sx={{ display: "flex", flexDirection: "column", width: { xs: "100%", sm: "75%" }, margin: "auto", padding: "1rem" }}>
      <h2 style={{ marginTop: 0 }}>Options</h2>
      <Stack>
        <div><Typography id="Threshold">
          Match Threshold
        </Typography></div>
        <Slider
          value={threshold}
          min={0}
          valueLabelDisplay="auto"
          onChange={(e, value) => {
            setThreshold(value);
          }}
          onChangeCommitted={(e, value) => {
            let thisOptions = { ...resultsOptions };
            thisOptions.threshold = value;
            setResultsOptions(thisOptions)
          }}
        />
        <Divider sx={{ mt: 1, mb: 1 }} />
        <TextField sx={{ mt: 1, mb: 1 }} id="outlined-basic" label="Search" autoComplete={false} onChange={(e) => {
          let thisOptions = { ...resultsOptions };
          thisOptions.searchTerm = e.target.value;

          setResultsOptions(thisOptions);
        }} value={resultsOptions.searchTerm} variant="outlined" />
        <Divider sx={{ mt: 1, mb: 1 }} />
        <Stack direction="row" sx={{ width: "100%", alignItems: "center", justifyContent: "space-between" }} >
          <Typography id="withinInstruments">
            Show within-instrument matches
          </Typography>
          <Switch
            checked={resultsOptions.intraInstrument}
            onChange={(e, value) => {
              let thisOptions = { ...resultsOptions };
              thisOptions.intraInstrument = value;
              setResultsOptions(thisOptions);
            }}
          />
        </Stack>
        <Divider sx={{ mt: 1, mb: 1 }} />
        <Stack direction="row" sx={{ width: "100%", alignItems: "center", justifyContent: "space-around" }} >
          {currentUser && <DropdownShareButton getShareLink={makePublicShareLink} ReactGA={ReactGA} />}
          <Button variant="contained" onClick={() => {
            ReactGA.event({
              category: "Actions",
              action: "Export Matches"
            })
            downloadExcel()
          }
          } >
            <SvgIcon component={xlsxSVG} inheritViewBox />
            <Typography> Export</Typography>
          </Button>
        </Stack>
      </Stack>
    </Card>
  )
}
