import React, { useRef, useEffect,useState, useContext } from 'react';
import '../css/Chat.css';
import { Button } from '@mui/material';
import Form from 'react-bootstrap/Form';
import { useAuth } from '../contexts/AuthContext';
import CustomizedDialogs from './ChatModal';

function ChatModal({ show, handleClose }) {
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
        const input = inputRef.current;
        input.select();
        // Call function to send message to chatbot API here
      }
    };
    useEffect(() => {
      const input = inputRef.current;
      input.select();
    }, []);

    return (
      <CustomizedDialogs show={show} onHide={handleClose}>
        <Modal.Header >
          <Modal.Title>Your virtual facilitator</Modal.Title>
          <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>

        </Modal.Header>
        <Modal.Body>
          <div style={{ maxHeight: '300px', minHeight: '100px', overflowY: 'scroll' }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={'chat-bubble chat-bubble-' + (msg.sender === 'user' ? 'left' : 'right')}>
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
          
        </Modal.Body>
        <Modal.Footer  style={{"flexWrap": "nowrap" }}>

          <Form onSubmit={handleSendMessage} style={{width: '100%'}}>
            <Form.Group controlId="formMessage">
              <Form.Control ref={inputRef}
                type="text"
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              </Form.Group>
            </Form>
        <Button variant="primary" onClick={handleSendMessage} disabled={message === ''}>
                Send
              </Button>
        </Modal.Footer>
      </Modal>
    );
  }
  
  export default ChatModal;