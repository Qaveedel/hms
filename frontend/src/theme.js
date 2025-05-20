import { createTheme } from '@mui/material/styles';
import { faIR } from '@mui/material/locale';

const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'Vazirmatn, Arial',
    h1: {
      fontFamily: 'Vazirmatn, Arial',
    },
    h2: {
      fontFamily: 'Vazirmatn, Arial',
    },
    h3: {
      fontFamily: 'Vazirmatn, Arial',
    },
    h4: {
      fontFamily: 'Vazirmatn, Arial',
    },
    h5: {
      fontFamily: 'Vazirmatn, Arial',
    },
    h6: {
      fontFamily: 'Vazirmatn, Arial',
    },
    subtitle1: {
      fontFamily: 'Vazirmatn, Arial',
    },
    subtitle2: {
      fontFamily: 'Vazirmatn, Arial',
    },
    body1: {
      fontFamily: 'Vazirmatn, Arial',
    },
    body2: {
      fontFamily: 'Vazirmatn, Arial',
    },
    button: {
      fontFamily: 'Vazirmatn, Arial',
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        dir: 'rtl',
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
  },
}, faIR);

export default theme; 