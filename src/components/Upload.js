import React, { useState } from "react";
import DragDrop from "./DragDrop";
import postData from "../utilities/postData";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItem,
  List,
  Paper,
  Button,
  Typography,
  CircularProgress,
  TextField,
  Stack,
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {
  AddCircleOutline as AddCircleOutlineIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Rowing,
} from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import InlineFeedback from "./InlineFeedback";
import ExistingInstruments from "./ExistingInstruments";
import { simplifyApi } from "../utilities/simplifyApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import pdfTableExtractor from "../utilities/pdf-table-extractor";

export default function Upload({
  fileInfos,
  setFileInfos,
  setApiData,
  existingInstruments,
  ReactGA,
}) {
  const [loading, setLoading] = useState(false);
  const [parseError, setParseError] = useState(false);
  const [matchError, setMatchError] = useState(false);
  const [grouping, setGrouping] = useState("");
  const history = useHistory();
  ReactGA.send({
    hitType: "pageview",
    page: "/",
    title: "Upload / Definition",
  });

  function filesReceiver(fileList) {
    const files = Array.from(fileList);
    let frp = [];
    files.forEach((file) => {
      frp.push(
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (file.name.split(".").pop().toLowerCase() === "pdf") {
              const uint8array = Uint8Array.from(
                atob(reader.result.split(",")[1]),
                (c) => c.charCodeAt(0)
              );
              var typedarray = new Uint8Array(uint8array);

              pdfTableExtractor(typedarray)
                .then((tables) => {
                  resolve({
                    file_name: file.name,
                    file_type: file.name.split(".").pop().toLowerCase(),
                    content: reader.result,
                    tables: tables.pageTables,
                  });
                })
                .catch((e) => {
                  // PDF clientside parsing failed for some reason - defer to the server
                  console.log(e);
                  resolve({
                    file_name: file.name,
                    file_type: file.name.split(".").pop().toLowerCase(),
                    content: reader.result,
                  });
                });
            } else {
              resolve({
                file_name: file.name,
                file_type: file.name.split(".").pop().toLowerCase(),
                content: reader.result,
              });
            }
          };
          reader.onerror = (e) => {
            reject(e);
          };
          reader.readAsDataURL(file);
        })
      );
    });
    Promise.all(frp)
      .then((allFiles) => {
        toast.promise(
          new Promise((resolve, reject) => {
            postData(process.env.REACT_APP_API_PARSE, allFiles, 15000)
              .then((data) => {
                const newFileInfos = [...fileInfos];
                // Load each returned file / instrument in the data
                data.forEach((instrument) => {
                  newFileInfos.push(instrument);
                });
                setFileInfos(newFileInfos);
                resolve(true);
              })
              .catch((e) => {
                console.log(e);
                setParseError(true);
                reject("Parse Error");
              });
          }),
          {
            pending: "Parsing files - this may take a while",
            success: "Success!",
            error: "Something went wrong - please try again",
          }
        );
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function existingReceiver(selected) {
    var newFileInfos = [...fileInfos];
    // Add the selected instruments to the infoList - attaching a instrument grouping key if needed
    // work through the current total selection and ensure any existing ones are in out out as required.
    const existingInstrumentIDs = existingInstruments.map((ei) => {
      return ei.instrument_id;
    });

    // trim out any which are existing instruments but not selected
    newFileInfos = newFileInfos
      .map((fi) => {
        if (
          (existingInstrumentIDs.includes(fi.instrument_id) &&
            selected.includes(fi.instrument_name)) ||
          !existingInstrumentIDs.includes(fi.instrument_id)
        ) {
          return fi;
        }
      })
      .filter((i) => {
        return i;
      });

    // add in any selected which are not already in there
    selected.forEach((sin) => {
      let si = existingInstruments.filter((inst) => {
        return inst.instrument_name === sin;
      })[0];
      si.grouping = grouping;
      if (
        newFileInfos.filter((inst) => {
          return inst.instrument_id === si.instrument_id;
        }).length === 0
      ) {
        console.log("adding " + si.instrument_name);
        newFileInfos.push(si);
      }
    });

    setFileInfos(newFileInfos);
  }

  const removeInstrument = (instrument_id) => {
    const newFileInfos = fileInfos.filter((fileInfo) => {
      return fileInfo.instrument_id !== instrument_id;
    });
    setFileInfos(newFileInfos);
  };

  const insertInstrument = (after_instrument_id) => {
    const after = fileInfos.findIndex(
      (f) => f.instrument_id === after_instrument_id
    );
    const newFileInfos = fileInfos
      .slice(0, after + 1)
      .concat([
        {
          instrument_id: String(new Date().getTime()),
          instrument_name: "",
          questions: [{ question_no: "", question_text: "" }],
        },
      ])
      .concat(fileInfos.slice(after + 1));
    console.log(newFileInfos);
    setFileInfos(newFileInfos);
  };

  const insertQuestion = (instrument_id, after_question_index) => {
    const instrument = fileInfos.filter((f) => {
      return f.instrument_id === instrument_id;
    })[0];

    const questions = instrument.questions
      .slice(0, after_question_index + 1)
      .concat([{ question_no: "", question_text: "" }])
      .concat(instrument.questions.slice(after_question_index + 1));

    const newFileInfos = fileInfos.map((fileInfo) => {
      if (fileInfo.instrument_id == instrument_id) {
        fileInfo.questions = questions;
      }
      return fileInfo;
    });

    setFileInfos(newFileInfos);
  };

  const updateInstrument = (instrument_id, value) => {
    const newFileInfos = fileInfos.map((fileInfo) => {
      if (fileInfo.instrument_id == instrument_id) {
        fileInfo.instrument_name = value;
      }
      return fileInfo;
    });
    setFileInfos(newFileInfos);
  };
  const removeQuestion = (instrument_id, question_index) => {
    const newFileInfos = fileInfos.map((fileInfo) => {
      if (fileInfo.instrument_id == instrument_id) {
        fileInfo.questions.splice(question_index, 1);
      }
      return fileInfo;
    });
    setFileInfos(newFileInfos);
  };

  const updateQuestion = (
    instrument_id,
    question_index,
    new_question_no,
    new_question_text
  ) => {
    const newFileInfos = fileInfos.map((fileInfo) => {
      if (fileInfo.instrument_id == instrument_id) {
        if (new_question_no)
          fileInfo.questions[question_index].question_no = new_question_no;
        if (new_question_text)
          fileInfo.questions[question_index].question_text = new_question_text;
      }
      return fileInfo;
    });
    setFileInfos(newFileInfos);
  };

  const QuestionDetail = (
    { question_no, question_text },
    index,
    instrument_id
  ) => {
    return (
      <ListItem
        key={instrument_id + "_" + index}
        sx={{ alignItems: "flex-end", pr: 0, mr: 0 }}
      >
        <TextField
          //setting the key to ensure the whole box is rerendered when the value changes
          key={instrument_id + "_" + index + "_" + question_no}
          sx={{ width: 35, px: 0, mx: 0 }}
          variant={"standard"}
          defaultValue={question_no}
          placeholder={question_no ? "" : "#"}
          onBlur={(e) => {
            updateQuestion(instrument_id, index, e.target.value);
          }}
        />
        <TextField
          multiline
          //setting the key to ensure the whole box is rerendered when the value changes
          key={instrument_id + "_" + index + question_text}
          sx={{ width: "100%", px: 1 }}
          variant={"standard"}
          defaultValue={question_text}
          placeholder={question_text ? "" : "Enter your question text"}
          onBlur={(e) => {
            updateQuestion(instrument_id, index, null, e.target.value);
          }}
        />
        <Stack direction="row" spacing={0} sx={{ mx: 0, right: 0 }}>
          <IconButton
            aria-label="delete"
            title="Delete this question"
            onClick={() => {
              removeQuestion(instrument_id, index);
            }}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            sx={{ pr: 0.7 }}
            aria-label="add-new"
            title="Add new question here"
            onClick={(e) => {
              insertQuestion(instrument_id, index);
            }}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Stack>
      </ListItem>
    );
  };

  const FileInfo = ({ instrument_name, instrument_id, questions }) => {
    const [expanded, setExpanded] = useState(questions.length < 2);
    return (
      <Accordion
        key={instrument_id}
        expanded={expanded}
        onChange={(e, ex) => setExpanded(ex)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            flexDirection: "row",
            alignItems: "center",
            "& .MuiAccordionSummary-content": {
              justifyContent: "space-between",
              alignItems: "center",
              mr: 0.5,
            },
          }}
        >
          <TextField
            variant="standard"
            sx={{ width: "100%", pr: 1, focusVisibleClassName: "NA" }}
            defaultValue={instrument_name}
            placeholder={
              instrument_name
                ? ""
                : "Manually create your instrument - add a name"
            }
            onBlur={(e) => {
              updateInstrument(instrument_id, e.target.value);
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
          <IconButton
            aria-label="delete"
            onClick={() => {
              removeInstrument(instrument_id);
            }}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            aria-label="add-new"
            onClick={(e) => {
              e.stopPropagation();
              insertInstrument(instrument_id);
            }}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            width: "100%",
            marginTop: -3,
            marginLeft: -2,
            maxHeight: "300px",
            maxHeight: "30vh",
            overflowY: "auto",
          }}
        >
          <List dense={true}>
            {questions.map((question, i) => {
              return QuestionDetail(question, i, instrument_id);
            })}
          </List>
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Paper
      elevation={4}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        padding: "1rem",
      }}
    >
      <ToastContainer />
      <InlineFeedback
        message="The file could not be parsed"
        severity="error"
        state={parseError}
        setState={setParseError}
      />
      <InlineFeedback
        message="The match proceedure failed"
        severity="error"
        state={matchError}
        setState={setMatchError}
      />

      <DragDrop filesReceiver={filesReceiver} sx={{ margin: "2rem" }} />
      <Stack
        direction={"row"}
        spacing={1}
        sx={{ mt: 2, mr: 1, display: "flex", alignItems: "center" }}
      >
        <ExistingInstruments
          sx={{ width: "100%" }}
          existingReceiver={existingReceiver}
          existingInstruments={existingInstruments}
          fileInfos={fileInfos}
        />
        <Tooltip title="Type in an instrument">
          <IconButton
            aria-label="add-new"
            onClick={(e) => {
              e.stopPropagation();
              insertInstrument();
            }}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      <Box sx={{ marginTop: "1rem" }}>
        {fileInfos.length
          ? fileInfos.map((fi) => {
              return <FileInfo {...fi}></FileInfo>;
            })
          : ""}
      </Box>

      <Button
        variant="contained"
        sx={{ margin: "2rem" }}
        disabled={fileInfos.length === 0 || loading}
        onClick={() => {
          setLoading(true);
          postData(
            process.env.REACT_APP_API_MATCH,
            { instruments: fileInfos },
            30000
          )
            .then((data) => {
              let simpleApi = simplifyApi(data, fileInfos);
              setApiData(simpleApi);
              console.log(simpleApi);
              setLoading(false);
              history.push("/model");
            })
            .catch((e) => {
              console.log(e);
              setMatchError(true);
            });
        }}
      >
        {!loading && <Typography>Harmonise</Typography>}
        {loading && <CircularProgress />}
      </Button>
    </Paper>
  );
}
