import { ThemeOptions, withTheme } from "@mui/material/styles";
import "../css/Pragmatica.css";

export const themeOptions: ThemeOptions = {
  typography: {
    body1: {
      fontFamily: "Pragmatica, sans-serif",
       fontWeight: 300,
       lineHeight: "1.3"
    },
    caption: {
      fontFamily: "Pragmatica, sans-serif",
      fontWeight: 600,
      fontSize: '0.625rem',
      lineHeight: "1.3"
    },
  },
  
  shape: {
    borderRadius: 10,
  },
  palette: {
    mode: "light",
    primary: {
      main: "#0de5b2",
    },
    secondary: {
      main: "#2b45ed",
    },
    background: {
      paper: "#fefcfb",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: "Pragmatica, sans-serif",
          fontWeight: 300,
          lineHeight: "1.3",
          //color: "black",
          "& h1, h2, h3, h4, h5, h6": {
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            lineHeight: "1.2",
            //color: "black"
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          "& input": {
            "&:-webkit-autofill": {
              transition:
                "background-color 50000s ease-in-out 0s, color 50000s ease-in-out 0s",
            },
          },
        },
      },
    },
  },
};
