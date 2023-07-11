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
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
      toast.promise(
        new Promise((resolve, reject) => { 
          postData(process.env.REACT_APP_API_PARSE, allFiles, 15000).then((data) => {
        const newFileInfos = [...fileInfos]
        // Load each returned file / instrument in the data 
        data.forEach(instrument => {
          newFileInfos.push(instrument);
        })
        setFileInfos(newFileInfos)
        resolve(true);
      }).catch(e => {
        console.log(e)
        setParseError(true);
        reject("Parse Error")
      });
    }),
     {
       pending: 'Parsing files - this may take a while',
       success: 'Success!',
       error: 'Something went wrong - please try again'
     }
     )
     
    });
  }

  function existingReceiver(selected) {
    var newFileInfos = [...fileInfos]
    // Add the selected instruments to the infoList - attaching a instrument grouping key if needed
    // work through the current total selection and ensure any existing ones are in out out as required.
    const existingInstrumentIDs = existingInstruments.map(ei => {
      return ei.instrument_id
    });

    // trim out any which are existing instruments but not selected
    newFileInfos = newFileInfos.map((fi) =>{
      if ((existingInstrumentIDs.includes(fi.instrument_id) && selected.includes(fi.instrument_name)) ||
         (!existingInstrumentIDs.includes(fi.instrument_id))) {
        return fi;
         }
    }).filter(i=>{return i});

    // add in any selected which are not already in there
    selected.forEach(sin=>{
      let si =  existingInstruments.filter(
        (inst) => { return inst.instrument_name === sin }
      )[0];
      si.grouping = grouping;
      if(newFileInfos.filter((inst)=> {
        return inst.instrument_id === si.instrument_id;
      }).length === 0) {
        console.log("adding " + si.instrument_name)
        newFileInfos.push(si)
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
      <ToastContainer/>
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
            postData(process.env.REACT_APP_API_MATCH, { instruments: fileInfos }, 30000).then((data) => {
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
