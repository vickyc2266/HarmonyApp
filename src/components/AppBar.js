import * as React from 'react';
import { AppBar, Box, Select, Toolbar, Typography, Avatar, Tooltip, MenuItem, Menu, Container, Divider } from '@mui/material';
import { Logout, JoinInner } from '@mui/icons-material/';
import { useAuth } from "../contexts/AuthContext"
import ThemeToggle from './ThemeToggle';
import GoogleIcon from '@mui/icons-material/Google'
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
const settings = ['My Harmony', 'Logout'];

const SettingsIcons = {
  'My Harmony': <JoinInner />,
  'Logout': <Logout />
}
function HarmonyAppBar() {
  const [anchorUser, setAnchorUser] = React.useState(null);
  const { currentUser, logout, signInWithGoogle, signInWithGitHub, signInWithTwitter } = useAuth();

  const handleOpenUserMenu = (event) => {
    setAnchorUser(event.currentTarget);
  };

  const handleUserMenuClick = (menuItem) => {
    switch (menuItem) {
      case 'Logout':
        handleCloseUserMenu();
        console.log('logging out');
        logout();
        break;
      default:

    }
  };

  const handleLanguageMenuClick = (menuItem) => {
    console.log(menuItem)
  };



  const handleCloseUserMenu = () => {
    setAnchorUser(null);
  };

  return (
    <AppBar position="absolute"
      sx={{
        background: 'transparent', boxShadow: 'none', top: 0
      }}>
      <Container sx={{ maxWidth: "100%!important" }}>
        <Toolbar disableGutters>

          <Box sx={{ flexGrow: 1 }}></Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="My Harmony">
              <Avatar
                src={currentUser && currentUser.photoURL}
                imgProps={{ referrerPolicy: "no-referrer" }}
                onClick={handleOpenUserMenu}
                sx={{ display: 'flex' }}>
                {currentUser && !currentUser.photoURL && currentUser.email.substring(1).toUpperCase()}
              </Avatar>
            </Tooltip>
            <Menu
              sx={{ mt: '45px'}}
              id="menu-appbar"
              anchorEl={anchorUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key="mode" ><ThemeToggle /></MenuItem>
              <MenuItem key="language" >
                <Select
                  size="small" 
                  id="language"
                  value={"EN"}
                  onChange={handleLanguageMenuClick}
                  sx={{  width:"100%"  }}
                >
                  <MenuItem value={"EN"}>English</MenuItem>
                  <MenuItem value={"PT"}>Portuguese</MenuItem>
                </Select>
              </MenuItem>
              <Divider />

              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => handleUserMenuClick(setting)} disabled={!currentUser}>
                  {SettingsIcons[setting]}
                  <Typography textAlign="center" sx={{ pl: 1 }}>{setting}</Typography>
                </MenuItem>
              ))}
              {!currentUser && [<Divider />,
              <p style={{margin: '0 0.5rem', textAlign: 'center'}}>Signing in with one of the OAuth providers below allows you access to My Harmony where you can save and share your harmonisations.</p>
              ]
              } 
              {!currentUser && <MenuItem key="SSOGoogle" onClick={() => signInWithGoogle().then(handleCloseUserMenu)}>
                <GoogleIcon />
                <Typography textAlign="center" sx={{ pl: 1 }}>Sign in with Google</Typography>
              </MenuItem>}
              {!currentUser && <MenuItem key="SSOGithub" onClick={() => signInWithGitHub().then(handleCloseUserMenu)}>
                <GitHubIcon />
                <Typography textAlign="center" sx={{ pl: 1 }}>Sign in with GitHub</Typography>
              </MenuItem>}
              {!currentUser && <MenuItem key="SSOTwitter" onClick={() => signInWithTwitter().then(handleCloseUserMenu)}>
                <TwitterIcon />
                <Typography textAlign="center" sx={{ pl: 1 }}>Sign in with Twitter</Typography>
              </MenuItem>}
            </Menu>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default HarmonyAppBar;