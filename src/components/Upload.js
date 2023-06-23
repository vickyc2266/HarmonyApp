import React, { useState } from "react"
import DragDrop from "./DragDrop";
import postData from "../utilities/postData";
import { Box, Accordion, AccordionSummary, AccordionDetails, ListItem, List, Paper, Button, Typography, CircularProgress } from '@mui/material'
import IconButton from '@mui/material/IconButton';
import {  Delete as DeleteIcon, ExpandMore as ExpandMoreIcon} from '@mui/icons-material';
import { useHistory } from "react-router-dom"
import InlineFeedback from "./InlineFeedback";

export default function Upload({ fileInfos, setFileInfos, setApiData }) {
  const [loading, setLoading] = useState(false);
  const [parseError, setParseError] = useState(false);
  const [matchError, setMatchError] = useState(false);
  const history = useHistory()
  function filesReceiver(fileList) {
    const files = Array.from(fileList);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        postData("https://api.harmonydata.org/text/parse",
          [
            {
              file_name: file.name,
              file_type: file.name.split('.').pop().toLowerCase(),
              content: event.target.result
            }
          ]).then(data => {
            const newFileInfos = [...fileInfos]
            newFileInfos.push(data[0]);
            fileInfos.push(data[0]);
            setFileInfos(newFileInfos)
          }).catch(e=>{
            setParseError(true);
          });
      };
      reader.readAsDataURL(file);
    });
    console.log(files)
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

  const FileInfo = ({ file_name, instrument_id, questions }) => {
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
          <Typography>{file_name}</Typography>
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
      <DragDrop filesReceiver={filesReceiver} sx={{ margin: "2rem" }} />
      <Box sx={{ marginTop: "2rem" }}>
        <InlineFeedback message="The file could not be parsed"  severity = "error" state={parseError} setState={setParseError} /> 
        {fileInfos.length ? fileInfos.map(FileInfo) : ""}
      </Box>
      <InlineFeedback message="The match proceedure failed"  severity = "error" state={matchError} setState={setMatchError} /> 
      <Button
        variant="contained"
        sx={{ margin: "2rem" }}
        disabled={fileInfos.length === 0 || loading}
        onClick={
          () => {
            setLoading(true);
            postData('https://api.harmonydata.org/text/match', {instruments: fileInfos}).then((data) => {
              setApiData(data);
              setLoading(false);
              history.push("/model")
            }).catch(e=>{

            })
          }
        }
      >
        {!loading && <Typography>Check your Matches</Typography>}
        {loading && <CircularProgress/>}
      </Button>
      
    </Paper>
  )
}
