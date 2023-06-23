import React from "react"
import { Alert, Collapse} from '@mui/material'
import IconButton from '@mui/material/IconButton';
import { Close as CloseIcon} from '@mui/icons-material';


export default function InlineFeedback({ severity, message, state, setState}) {
   return (
   <Collapse in={state}>
    <Alert
    severity={severity}
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={() => {
            setState(false);
          }}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      }
      sx={{ mb: 2 }}
    >
      {message}
    </Alert>
  </Collapse>
  )
}
