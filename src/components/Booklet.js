import React, { lazy, Suspense,  useState, useEffect } from 'react';
import {Button} from '@mui/material';
import ChatModal from './ChatModal';
import '../css/Booklet.css';
import { useParams } from "react-router";

const loadPage =(booklet, page) => {
  return React.lazy(() => import('../booklets/'+ booklet + '/Page' + page));
} 


function Booklet() {
  let { bookletID } = useParams()
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({});
  const [showChat, setShowChat] = useState(false);



  var Page = loadPage(bookletID, currentPage);
 
  useEffect(() => {
    
  }, [bookletID, currentPage]);

  const nextPage = () =>{
    setCurrentPage(currentPage+1);
    Page = loadPage(bookletID, currentPage);
  }
  const prevPage = () =>{
    if(currentPage >1) setCurrentPage(currentPage-1);
    Page = loadPage(bookletID, currentPage);
  }
  const handleAnswer = (questionId, answer) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [questionId]: answer,
    }));
    const nextPage = currentPage + 1;
    if (nextPage < questions.length) {
      setCurrentPage(nextPage);
    } else {
      // Submit form data to server
    }
  };

  const handleHelpClick = () => {
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
  };

  return (
    <div className="booklet">
      <div className="booklet-header">
        <h1>Questionnaire</h1>
        <Button className="Questionnaire-help" onClick={handleHelpClick}>Help<i className="fa fa-question-circle" /></Button>

      </div>
      <div className="booklet-page">
        <Suspense><Page/></Suspense>
      </div>


      { showChat && (
          <ChatModal show={showChat} handleClose={handleCloseChat}></ChatModal>
      )
      }

       <Button className="Questionnaire-help" 
        onClick={prevPage}>Prev<i className="fa fa-question-circle" />
       </Button>
       <Button className="Questionnaire-help" 
        onClick={nextPage}>Next<i className="fa fa-question-circle" />
       </Button>

    </div>
  );
}

export default Booklet;