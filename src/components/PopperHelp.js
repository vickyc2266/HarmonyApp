import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ArrowedPopper from "./ArrowedPopper";
import { useState, useRef, useEffect } from "react";
import { IconButton } from "@mui/material";

function PopperHelp({
  sx = {},
  placement = "top-end",
  component = <HelpOutlineIcon fontSize="large" />,
  children,
  setOpen,
}) {
  const [anchorEl, setAnchorEl] = useState();
  const anchorRef = useRef();

  useEffect(() => {
    if (setOpen && anchorRef.current) {
      setAnchorEl(anchorRef.current);
    }
  }, [setOpen]);

  function handleHover() {
    setAnchorEl(anchorRef.current);
  }
  function handleUnHover() {
    setAnchorEl(null);
  }

  function handleClick(e) {
    e.stopPropagation();
    e.nativeEvent.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setAnchorEl(anchorEl ? null : anchorRef.current || null);
  }
  return (
    <IconButton
      sx={sx}
      className="pulse"
      ref={anchorRef}
      onClickCapture={handleClick}
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
