import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <Tooltip title={darkMode ? 'حالت روشن' : 'حالت تاریک'}>
      <IconButton color="inherit" onClick={toggleTheme} sx={{ ml: 1 }}>
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle; 