import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


const TwoWay = ({ Q1, Q2, percentage }) => {

    const interpolateBetweenColors = (
        fromColor,
        toColor,
        percent
      ) => {
        const delta = percent / 100;
        const r = Math.round(toColor.r + (fromColor.r - toColor.r) * delta);
        const g = Math.round(toColor.g + (fromColor.g - toColor.g) * delta);
        const b = Math.round(toColor.b + (fromColor.b - toColor.b) * delta);
      
        return `rgba(${r}, ${g}, ${b}, 0.7)`;
      };
    

  return (
      <Card variant="outlined" sx={{ display: 'flex', width:'100%', height: '5rem', padding: '0.5rem', margin: '0.5rem', justifyContent: 'space-between', alignItems: 'center'}} >
        <Typography variant="body">
                {Q1.text}    
        </Typography>
        <Box sx={{ width: '4em' }} >
            <CircularProgressbar 
                value={percentage} 
                text={`${percentage}`}
                strokeWidth={15}
                styles={{
                    path: {
                        stroke:  interpolateBetweenColors({ r: 30, g: 255, b: 30 }, { r: 255, g: 30, b: 30 }, percentage)
                    },
                    text: {
                        fill: 'black',
                        fontSize: '1.5rem'
                    }
                  }}
            />
        </Box>
        <Typography variant="body">
                {Q2.text}
        </Typography>
      </Card>
  );
};

export default TwoWay;