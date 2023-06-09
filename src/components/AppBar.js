import * as React from 'react';
import { AppBar, Box, Button, Toolbar, Typography, Avatar, Tooltip, MenuItem, Menu, Container } from '@mui/material';
import { Settings, ManageAccounts, Language, Logout, Menu as MenuIcon, Person as PersonIcon, JoinInner } from '@mui/icons-material/';
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from '@mui/material/styles'


const settings = ['My harmonizations', 'Language', 'Logout'];
const SettingsIcons = {
  'My harmonizations' : <JoinInner/>,
  'Language': <Language />,
  'Logout': <Logout />
}
function UniAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { currentUser, logout,  resetPassword, updateEmail, updatePassword } = useAuth();
  const theme = useTheme();

  console.log(currentUser);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleMenuItemClick = (menuItem) => {
    switch (menuItem){
      case 'Logout':
        handleCloseUserMenu();
        console.log('logging out');
        logout();
        break;
    }
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar  position="fixed"  style={{ background: 'transparent', boxShadow: 'none'}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <Avatar
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </Avatar>
        
          </Box>

<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            
          </Box>
<Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
                <Avatar onClick={handleOpenUserMenu} sx={{ display: 'flex' }}>
                  {currentUser && currentUser.photoURL && <img style={{width:"100%", height:"100%"}} src={currentUser.photoURL}/> }
                  {currentUser && !currentUser.photoURL && currentUser.email.substring(1).toUpperCase() }
                </Avatar>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={()=>handleMenuItemClick(setting)}>
                  { SettingsIcons[setting] }
                  <Typography textAlign="center" sx={{pl:1}}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default UniAppBar;