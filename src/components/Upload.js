import React, { useState } from "react"
import DragDrop from "./DragDrop";
import postData from "../utilities/postData";
import { Box, Accordion, AccordionSummary, AccordionDetails, ListItem, List, Paper, Button, Typography, CircularProgress } from '@mui/material'
import IconButton from '@mui/material/IconButton';
import { Delete as DeleteIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useHistory } from "react-router-dom"
import InlineFeedback from "./InlineFeedback";
import ExistingInstruments from "./ExistingInstruments";
import { simplifyApi } from "../utilities/simplifyApi";
export default function Upload({ fileInfos, setFileInfos, setApiData, existingInstruments }) {
  const [loading, setLoading] = useState(false);
  const [parseError, setParseError] = useState(false);
  const [matchError, setMatchError] = useState(false);
  const [grouping, setGrouping] = useState("");
  const history = useHistory()

  function filesReceiver(fileList) {
    const files = Array.from(fileList);
    let frp = [];
    files.forEach(file => {
      frp.push(new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            file_name: file.name,
            file_type: file.name.split('.').pop().toLowerCase(),
            content: reader.result
          }
          );
        }
        reader.onerror = () => {
          reject({})
        }
        reader.readAsDataURL(file);
      }))
    });
    Promise.all(frp).then((allFiles) => {
      postData("https://api.harmonydata.org/text/parse", allFiles, 30000).then((data) => {
        const newFileInfos = [...fileInfos]
        // Load each returned file / instrument in the data 
        data.forEach(instrument => {
          newFileInfos.push(instrument);
        })
        setFileInfos(newFileInfos)
      }).catch(e => {
        console.log(e)
        setParseError(true);
      });
    });
  }

  function existingReceiver(instrumentList) {
    const newFileInfos = [...fileInfos]
    // Add the selected instruments to the infoList - attaching a instrument grouping key if needed
    instrumentList.forEach(instrumentName => {
      let instrument =  existingInstruments.filter(
        (inst) => { return inst.instrument_name === instrumentName }
      )[0];
      instrument.grouping = grouping;
      // do not add them more than once
      if(newFileInfos.filter((inst)=> {
        return inst.instrument_id === instrument.instrument_id;
      }).length === 0) {
        newFileInfos.push(instrument)
      }
      
    })
    setFileInfos(newFileInfos)
  }

  const removeInstrument = (instrument_id) => {
    const newFileInfos = fileInfos.filter((fileInfo) => {
      return fileInfo.instrument_id !== instrument_id;
    })
    setFileInfos(newFileInfos)
  }

  const removeQuestion = (instrument_id, question_index) => {

    const newFileInfos = fileInfos.filter((fileInfo) => {
      return fileInfo.instrument_id !== instrument_id || fileInfo.questions.splice(question_index, 1);
    })
    setFileInfos(newFileInfos)
  }

  const QuestionDetail = ({ question_text }, index, instrument_id) => {
    if (question_text) {
      return (
        <ListItem key={(instrument_id + '_' + index)}
          secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => { removeQuestion(instrument_id, index); }}>
              <DeleteIcon />
            </IconButton>
          }>
          <Typography>{question_text}</Typography>
        </ListItem>
      )
    }
  }

  const FileInfo = ({ instrument_name, instrument_id, questions }) => {
    return (
      <Accordion key={instrument_id} >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            flexDirection: "row-reverse", alignItems: "center",
            '& .MuiAccordionSummary-content': {
              justifyContent: "space-between", alignItems: "center"
            }
          }}
        >
          <Typography>{instrument_name}</Typography>
          <IconButton edge="start" aria-label="delete" onClick={() => { removeInstrument(instrument_id); }}>
            <DeleteIcon />
          </IconButton>
        </AccordionSummary>
        <AccordionDetails sx={{ maxHeight: "300px", maxHeight: "30vh", overflowY: "scroll" }} >
          <List dense={true}>
            {questions.map((question, i) => {
              return (QuestionDetail(question, i, instrument_id))
            })}
          </List>
        </AccordionDetails>
      </Accordion>
    )

  }

  return (
    <Paper elevation={4} sx={{ display: "flex", flexDirection: "column", width: "100%", padding: "1rem" }}>

      <InlineFeedback message="The file could not be parsed" severity="error" state={parseError} setState={setParseError} />
      <InlineFeedback message="The match proceedure failed" severity="error" state={matchError} setState={setMatchError} />

      <DragDrop filesReceiver={filesReceiver} sx={{ margin: "2rem" }} />
      <ExistingInstruments existingReceiver={existingReceiver} existingInstruments={existingInstruments} fileInfos={fileInfos} />
      <Box sx={{ marginTop: "2rem" }}>
        {fileInfos.length ? fileInfos.map(FileInfo) : ""}
      </Box>

      <Button
        variant="contained"
        sx={{ margin: "2rem" }}
        disabled={fileInfos.length === 0 || loading}
        onClick={
          () => {
            setLoading(true);
            postData('https://api.harmonydata.org/text/match', { instruments: fileInfos }, 30000).then((data) => {
              let simpleApi = simplifyApi(data, fileInfos);
              setApiData(simpleApi);
              console.log(simpleApi);
              setLoading(false);
              history.push("/model")
            }).catch(e => {
              console.log(e);
              setMatchError(true);
            })
          }
        }
      >
        {!loading && <Typography>Harmonise</Typography>}
        {loading && <CircularProgress />}
      </Button>

    </Paper>
  )
}
