import { Popper, Fade, Paper } from "@mui/material";

function ArrowedPopper({ anchorEl, open, placement, children }) {
  return (
    <Popper
      elevation={8}
      style={{ zIndex: 100, maxWidth: "500px", margin: "80px" }}
      anchorEl={anchorEl}
      open={open}
      placement={placement}
      transition
      modifiers={[
        {
          name: "flip",
          enabled: true,
          options: {
            altBoundary: false,
            rootBoundary: "document",
            padding: 8,
          },
        },
        {
          name: "preventOverflow",
          enabled: true,
          options: {
            altAxis: false,
            altBoundary: false,
            tether: true,
            rootBoundary: "document",
            padding: 8,
          },
        },
        {
          name: "arrow",
          enabled: false,
        },
      ]}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={300}>
          <Paper elevation={8} sx={{ p: 2 }}>
            {children}
          </Paper>
        </Fade>
      )}
    </Popper>
  );
}

export default ArrowedPopper;
