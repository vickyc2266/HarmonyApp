import React from "react"
import { useTheme, List, ListItem, Button, Popper, Fade, Paper, ListItemIcon, ListItemText, Typography } from '@mui/material'


import PopupState, { bindToggle, bindPopper } from "material-ui-popup-state"
//import { fade } from "@material-ui/core/styles/colorManipulator"
import { Facebook, Twitter, Reddit, Link, Share, LinkedIn } from "@mui/icons-material"


export default function DropdownShareButton({ getShareLink, ReactGA }) {
  const classes = useTheme()
  async function handleShare(e) {
    e.preventDefault()
    const target = e.currentTarget.id;


    const ahref = await getShareLink();
    const encAhref = encodeURIComponent(ahref);
    var link
    ReactGA.event('share', {
      item_id: ahref,
      method: target
    })

    switch (target) {
      case "linkedin":
        link = `https://www.linkedin.com/sharing/share-offsite/?url=${encAhref}`
        open(link)
        break
      case "facebook":
        link = `https://www.facebook.com/sharer/sharer.php?u=${encAhref}`
        open(link)
        break
      case "twitter":
        link = `https://twitter.com/intent/tweet?url=${encAhref}`
        open(link)
        break
      case "reddit":
        link = `https://www.reddit.com/submit?url=${encAhref}`
        open(link)
        break
      case "copy":
        navigator.clipboard.writeText(ahref)
        break
      default:
        break
    }
  }
  const open = socialLink => {
    window.open(socialLink, "_blank")
  }
  return (
    <PopupState variant="popper" popupId="demo-popup-popper">
      {popupState => (
        <div>
          <Button

            variant="contained"
            {...bindToggle(popupState)}
          >
            <Share />
            <Typography> Share </Typography>
          </Button>
          <Popper {...bindPopper(popupState)} transition>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper>
                  <List dense={true} className={classes.paper}>
                    <ListItem
                      button
                      id="twitter"
                      onClick={handleShare}
                    >
                      <ListItemIcon>
                        <Twitter />
                      </ListItemIcon>
                      <ListItemText primary="Twitter" />
                    </ListItem>


                    <ListItem
                      button
                      id="linkedin"
                      onClick={handleShare}
                    >
                      <ListItemIcon>
                        <LinkedIn />
                      </ListItemIcon>
                      <ListItemText primary="LinkedIn" />
                    </ListItem>

                    <ListItem
                      button
                      id="facebook"
                      onClick={handleShare}
                    >
                      <ListItemIcon>
                        <Facebook />
                      </ListItemIcon>
                      <ListItemText primary="Facebook" />
                    </ListItem>

                    <ListItem
                      button
                      id="reddit"
                      onClick={handleShare}
                    >

                      <ListItemIcon>
                        <Reddit />
                      </ListItemIcon>
                      <ListItemText primary="Reddit" />
                    </ListItem>
                    <ListItem
                      button
                      id="copy"
                      onClick={handleShare}
                    >
                      <ListItemIcon>
                        <Link />
                      </ListItemIcon>
                      <ListItemText primary="Copy Link" />
                    </ListItem>
                  </List>
                </Paper>
              </Fade>
            )}
          </Popper>
        </div>
      )}
    </PopupState>
  )
}