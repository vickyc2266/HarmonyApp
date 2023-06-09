import React, { useRef, useEffect,useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled, useThemeProps } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../contexts/AuthContext';
import { Typography, Dialog, DialogTitle, DialogContent,DialogActions, TextField, IconButton} from '@mui/material';
import '../css/Chat.css';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function ChatModal( props ) {
  const { show, handleClose } = props
  const [open, setOpen] = React.useState(show);
  const { currentUser } = useAuth();
  const inputRef = useRef(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([{ text: 'Hello - how can I help you?', sender: 'ai'} ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message !== '') {
      setMessages([...messages, { text: message, sender: 'user' }]);
      setMessage('');
      console.log(currentUser.accessToken);

      // Call function to send message to chatbot API here
    }
  };
  useEffect(() => {

  }, []);

  return (
    <div>
      <BootstrapDialog
        keepMounted={true}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Virtual Facilitator
        </BootstrapDialogTitle>
        <DialogContent dividers sx ={{ maxHeight: '300px', minHeight: '100px', overflowY: 'scroll' }}>
            {messages.map((msg, idx) => (
              <Typography gutterBottom>
              <div key={idx} className={'chat-bubble chat-bubble-' + (msg.sender === 'user' ? 'left' : 'right')}>
                <span>{msg.text}</span>
              </div>
              </Typography>
            ))}
        </DialogContent>
        <DialogActions>
        <TextField ref={inputRef}
                type="text"
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                autoFocus 
                variant="outlined"
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter') {
                    setMessage(message)
                  }
                }}
            />
          <Button onClick={handleSendMessage} disabled={message === ''}>
            Send
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}