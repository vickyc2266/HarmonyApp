import React, { useState } from "react"
import DragDrop from "./DragDrop";
import postData from "../utilities/postData";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Paper, Button } from "@mui/material";
export default function Upload() {
  const [fileInfos, setFileInfos] = useState([]);
  function filesReceiver(fileList) {
    const files = Array.from(fileList);
    files.map(file => {
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
        });
      };
      reader.readAsDataURL(file);
  });
    console.log(files)
  }

  const removeListItem = (instrument_id) => {
    const newFileInfos = fileInfos.filter((fileInfo) => {
      return fileInfo.instrument_id != instrument_id;
    })
    setFileInfos(newFileInfos)
  }

  const FileInfo = ({file_name, instrument_id, questions}) => {
    return (
    <ListItem key={instrument_id}
    secondaryAction={
      <IconButton edge="end" aria-label="delete" onClick={() => { removeListItem(instrument_id); }}>
        <DeleteIcon />
      </IconButton>
    }
  >
    <ListItemAvatar>
      <Avatar>
        <AssignmentIcon />
      </Avatar>
    </ListItemAvatar>
    <ListItemText
      secondary={'Containing ' + questions.length + ' questions'}
      primary={file_name}
    />
  </ListItem>)

  }



  return (
    <Paper sx={{ marginRight:'auto', display: "flex", flexDirection: "column"}}>
       <List dense={true}>
              {fileInfos.map(FileInfo)}
            </List>
      <DragDrop filesReceiver={filesReceiver} sx ={{ margin: "2rem"}} />
      <Button variant="contained" sx={{ margin: "2rem"}}>
        Check your Matches
      </Button>
    </Paper>
  )
}
