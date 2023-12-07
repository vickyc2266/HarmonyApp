import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ArrowedPopper from "./ArrowedPopper";
import { useState, useRef } from "react";
import { IconButton } from "@mui/material";

function PopperHelp({
  sx = {},
  placement = "bottom-start",
  component = <HelpOutlineIcon fontSize="large" />,
  children,
}) {
  const [anchorEl, setAnchorEl] = useState();
  const anchorRef = useRef();

  function handleHover() {
    setAnchorEl(anchorRef.current);
  }
  function handleUnHover() {
    setAnchorEl(null);
  }

  function handleClick() {
    setAnchorEl(anchorEl ? null : anchorRef.current || null);
  }
  return (
    <IconButton
      sx={sx}
      className="pulse"
      ref={anchorRef}
      onClick={handleClick}
      onMouseOver={handleHover}
      onMouseLeave={handleUnHover}
    >
      <ArrowedPopper
        open={Boolean(anchorEl)}
        placement={placement}
        anchorEl={anchorEl}
      >
        {children}
      </ArrowedPopper>

      {component}
    </IconButton>
  );
}

export default PopperHelp;
