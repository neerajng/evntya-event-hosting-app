import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react'; 


export const theme = createTheme({
  palette: {
    brandYellow: {
      main: '#FFF000',      
    },
  },
  typography: {
    brandFont: "'Jua', sans-serif",
  },
});