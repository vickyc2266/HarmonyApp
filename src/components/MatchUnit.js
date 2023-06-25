import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import 'react-circular-progressbar/dist/styles.css';
import MatchCircle from './MatchCircle';

const MatchUnit = ({ Q1, Q2, percentage }) => {
  return (
      <Card variant="outlined" sx={{ display: 'flex', width:'100%', height: '7rem', padding: '0.5rem', margin: '0.5rem 0', justifyContent: 'space-between', alignItems: 'center', textAlign:"center"}} >
        <Box sx={{display:'flex',height:'100%', flexDirection:'column', justifyContent: 'space-between', alignItems: 'center',width:'45%'}}>
        <Typography variant="caption" sx={{fontSize:'0.625rem',}}>
          {Q1.instrument.name} - Q{Q1.no}
        </Typography>
          <Typography variant="body1">
                {Q1.text}   
        </Typography>
        <Typography variant="caption" sx={{visibility:"hidden"}}>
          {Q1.instrument.name} - Q{Q1.no}
        </Typography>
        </Box>
        <Box sx={{ width: '4em', margin:'0.5rem' }} >
            <MatchCircle percentage={percentage}/>
        </Box>
        <Box sx={{display:'flex',height:'100%',  flexDirection:'column', justifyContent: 'space-between', alignItems: 'center',width:'45%', textAlign:"center"}}>
        <Typography variant="caption">
          {Q2.instrument.name} - Q{Q2.no}
          </Typography>
          <Typography variant="body1" >
            {Q2.text}
        </Typography>
        <Typography variant="caption" sx={{visibility:"hidden"}}>
          {Q2.instrument.name} - Q{Q2.no}
        </Typography>
        </Box>
      </Card>
  );
};

export default MatchUnit;