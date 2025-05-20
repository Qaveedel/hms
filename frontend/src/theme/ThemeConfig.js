import { createTheme } from '@mui/material/styles';
import { faIR } from '@mui/material/locale';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import createCache from '@emotion/cache';

// Common theme settings
const commonSettings = {
  direction: 'rtl',
  typography: {
    fontFamily: 'Vazirmatn, Roboto, Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          textAlign: 'right',
          justifyContent: 'flex-start',
          '& .MuiButton-startIcon': {
            marginLeft: '8px',
            marginRight: '-4px',
          },
          '& .MuiSvgIcon-root': {
            marginLeft: '8px',
            marginRight: '-4px',
          }
        },
        startIcon: {
          marginLeft: '8px',
          marginRight: '-4px',
        }
      },
      defaultProps: {
        disableRipple: false,
      },
    },
    MuiTextField: {
      defaultProps: {
        dir: 'rtl',
        inputProps: {
          dir: 'rtl',
        },
      },
    },
    MuiInputBase: {
      defaultProps: {
        dir: 'rtl',
      },
    },
    MuiFormControl: {
      defaultProps: {
        dir: 'rtl',
      },
    },
    MuiSelect: {
      defaultProps: {
        dir: 'rtl',
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          direction: 'rtl',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          textAlign: 'right',
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          direction: 'rtl',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          direction: 'rtl',
          textAlign: 'right',
        },
      },
    },
    MuiDialog: {
      defaultProps: {
        dir: 'rtl',
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          textAlign: 'right',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          textAlign: 'right',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          direction: 'rtl',
          justifyContent: 'flex-start',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          direction: 'rtl',
          textAlign: 'right',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          direction: 'rtl',
        },
      },
    },
  },
};

// Light theme
export const lightTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'light',
    primary: {
      main: '#00bcd4',
      light: '#62efff',
      dark: '#008ba3',
    },
    secondary: {
      main: '#ff9800',
      light: '#ffc947',
      dark: '#c66900',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
}, faIR);

// Dark theme
export const darkTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'dark',
    primary: {
      main: '#00acc1',
      light: '#5ddef4',
      dark: '#007c91',
    },
    secondary: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#b0b0b0',
    },
  },
}, faIR);

// RTL cache (same for both themes)
export const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// Create a custom theme based on the dark mode state
export const getTheme = (darkMode) => darkMode ? darkTheme : lightTheme; 