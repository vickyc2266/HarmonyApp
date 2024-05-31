import React from "react";
import { Box, Button } from "@mui/material";

function GoogleDriveImport({ filesReceiver, sx }) {
  return (
    <Box sx={sx}>
      <Button variant="contained" size="large" sx={{ mx: "auto" }}>
        <img
          style={{ height: "2rem", marginRight: 10 }}
          src={require("../img/google-drive.png")}
          alt="Google Drive"
        />
        Import Forms, Sheets or Documents from Google Drive
      </Button>
    </Box>
  );
}

export default GoogleDriveImport;
