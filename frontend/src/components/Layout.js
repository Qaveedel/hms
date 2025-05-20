import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ExitToApp as ExitToAppIcon,
  LocalHospital as HospitalIcon,
  EventNote as EventNoteIcon,
  CalendarToday as CalendarIcon,
  Medication as MedicationIcon,
} from '@mui/icons-material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import ThemeToggle from './ThemeToggle';
import { useTheme as useAppTheme } from '../theme/ThemeContext';

function Layout({ children }) {
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const { darkMode } = useAppTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = React.useState(!isMobile);

  const menuItems = [
    { text: 'داشبورد', icon: <DashboardIcon />, path: '/' },
    { text: 'لیست بیماران', icon: <PeopleIcon />, path: '/patients' },
    { text: 'تریاژ', icon: <HospitalIcon />, path: '/triage' },
    { text: 'ویزیت پزشک', icon: <EventNoteIcon />, path: '/doctor-visit' },
    { text: 'نسخه', icon: <MedicationIcon />, path: '/prescription' },
    { text: 'نوبت‌دهی', icon: <CalendarIcon />, path: '/appointment' },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  const drawerWidth = 280;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', direction: 'rtl' }}>
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          height: '64px',
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: darkMode ? 'background.paper' : 'white',
          color: 'text.primary',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          left: 0,
          right: 0,
          width: '100%',
          direction: 'rtl'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', direction: 'rtl' }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              textAlign: 'center',
              fontWeight: 'bold',
              color: muiTheme.palette.primary.main
            }}
          >
            سیستم مدیریت هوشمند مدارک پزشکی بارمان
          </Typography>

          <Button 
            color="inherit" 
            onClick={handleLogout} 
            startIcon={<ExitToAppIcon />}
            sx={{
              '& .MuiButton-startIcon': {
                marginLeft: '8px',
                marginRight: '-4px',
              },
              direction: 'rtl',
              whiteSpace: 'nowrap',
              color: muiTheme.palette.primary.main
            }}
          >
            خروج
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ThemeToggle />
            <IconButton
              color="inherit"
              onClick={() => setDrawerOpen(!drawerOpen)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
          ml: drawerOpen ? `${drawerWidth}px` : 0,
          mr: 0,
          position: 'relative',
          padding: 3,
          backgroundColor: 'background.default',
          marginTop: '64px',
          direction: 'rtl',
          transition: muiTheme.transitions.create(['margin', 'width'], {
            easing: muiTheme.transitions.easing.sharp,
            duration: muiTheme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {children}
      </Box>
      
      {/* Sidebar */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        sx={{
          display: 'block',
          '& .MuiDrawer-paper': {
            position: 'fixed',
            top: '64px',
            left: 0,
            width: drawerWidth,
            height: 'calc(100% - 64px)',
            backgroundColor: darkMode ? 'background.paper' : '#f8f9fa',
            boxSizing: 'border-box',
            borderRight: darkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.12)',
            borderLeft: 'none',
            direction: 'rtl'
          },
        }}
        ModalProps={{ keepMounted: true }}
      >
        <Box sx={{ overflow: 'auto', direction: 'rtl' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem 
                button 
                key={item.text}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setDrawerOpen(false);
                }}
                sx={{
                  '&:hover': {
                    backgroundColor: darkMode 
                      ? 'rgba(144, 202, 249, 0.08)' 
                      : 'rgba(25, 118, 210, 0.08)',
                  },
                  borderBottom: darkMode 
                    ? '1px solid rgba(255,255,255,0.05)' 
                    : '1px solid #eee',
                  '&:last-child': { borderBottom: 'none' },
                  padding: '16px 24px',
                  textAlign: 'right',
                  direction: 'rtl',
                  transition: 'all 0.3s ease',
                  '&:hover .MuiListItemIcon-root': {
                    color: muiTheme.palette.primary.main,
                    transform: 'scale(1.1)',
                  },
                  '&:hover .MuiListItemText-primary': {
                    color: muiTheme.palette.primary.main,
                  }
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 40,
                    color: 'text.secondary',
                    transition: 'all 0.3s ease',
                    marginLeft: 2,
                    marginRight: -1
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{ 
                    fontWeight: 'medium',
                    transition: 'all 0.3s ease'
                  }}
                  sx={{ textAlign: 'right' }}
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <List>
            <ListItem 
              button 
              onClick={handleLogout}
              sx={{
                '&:hover': {
                  backgroundColor: darkMode 
                    ? 'rgba(244, 67, 54, 0.08)' 
                    : 'rgba(220, 0, 78, 0.08)',
                },
                padding: '16px 24px',
                textAlign: 'right',
                direction: 'rtl',
                transition: 'all 0.3s ease',
                '&:hover .MuiListItemIcon-root': {
                  color: muiTheme.palette.error.main,
                  transform: 'scale(1.1)',
                },
                '&:hover .MuiListItemText-primary': {
                  color: muiTheme.palette.error.main,
                }
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: 40,
                  color: 'text.secondary',
                  transition: 'all 0.3s ease',
                  marginLeft: 2,
                  marginRight: -1
                }}
              >
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText 
                primary="خروج" 
                primaryTypographyProps={{ 
                  fontWeight: 'medium',
                  transition: 'all 0.3s ease'
                }}
                sx={{ textAlign: 'right' }}
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}

export default Layout; 