import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import { useTheme } from '@mui/material/styles';
import 'react-circular-progressbar/dist/styles.css';


const MatchCircle = ({percentage}) => {
  const theme = useTheme();
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
            <CircularProgressbar 
                text={percentage} 
                value={`${Math.abs(percentage)}`}
                strokeWidth={15}
                styles={{
                    path: {
                        stroke:  interpolateBetweenColors({ r: 30, g: 255, b: 30 }, { r: 255, g: 30, b: 30 }, Math.abs(percentage))
                    },
                    text: {
                        fill:  theme.palette.primary.dark,
                        fontWeight: 600,
                        fontSize: '1.5rem'
                    }
                  }}
            />
  );
};

export default MatchCircle;