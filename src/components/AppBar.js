import * as React from 'react';
import { AppBar, Box, Select, Toolbar, Typography, Avatar, Tooltip, MenuItem, Menu, Container, Divider } from '@mui/material';
import { Logout, JoinInner } from '@mui/icons-material/';
import { useAuth } from "../contexts/AuthContext"
import ThemeToggle from './ThemeToggle';
import GoogleIcon from '@mui/icons-material/Google'
import GitHubIcon from '@mui/icons-material/GitHub';
const settings = ['My harmonizations', 'Logout'];

const SettingsIcons = {
  'My harmonizations': <JoinInner />,
  'Logout': <Logout />
}
function HarmonyAppBar() {
  const [anchorUser, setAnchorUser] = React.useState(null);
  const { currentUser, logout, signInWithGoogle } = useAuth();

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
              {!currentUser && <Divider />}
              {!currentUser && <MenuItem key="SSOGoogle" onClick={() => signInWithGoogle().then(handleCloseUserMenu)}>
                <GoogleIcon />
                <Typography textAlign="center" sx={{ pl: 1 }}>Sign in with Google</Typography>
              </MenuItem>}
              {!currentUser && <MenuItem key="SSOGithub" disabled={true} onClick={() => signInWithGoogle().then(handleCloseUserMenu)}>
                <GitHubIcon />
                <Typography textAlign="center" sx={{ pl: 1 }}>Sign in with GitHub</Typography>
              </MenuItem>}
            </Menu>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default HarmonyAppBar;