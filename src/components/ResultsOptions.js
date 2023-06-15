import React, { useEffect, useState } from "react"
import { Question, Instrument } from "../utilities/types"
import { Paper, Slider, Switch, FormGroup, FormControlLabel, List, ListItem} from '@mui/material'
import MatchUnit from "./matchUnit";
//import gadEnPt from "../utilities/testPosts"



export default function ResultsOptions({ resultsOptions, setResultsOptions }) {

  const currentThreshold = 0.7;

  return (
    <Paper elevation={4} sx={{ display: "flex", flexDirection: "column", width: "100%", padding: "1rem" }}>
      <List>
        <ListItem>
        <Switch defaultChecked />
        </ListItem>
        <ListItem>
        <Slider  valueLabelDisplay="auto" defaultValue={70} />
        </ListItem>
        </List>
      

    </Paper>
  )
}
