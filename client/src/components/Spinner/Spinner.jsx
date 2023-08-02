import { useState } from 'react';
import {CircularProgress} from '@mui/material';

let spinnerVisible = false;
let setSpinnerVisible;

export const Spinner = () => {
  [spinnerVisible, setSpinnerVisible] = useState(false);

  return (
    <>
      {spinnerVisible && <CircularProgress />}
    </>
  );
};

export const showSpinner = () => {
  setSpinnerVisible = true;
};

export const hideSpinner = () => {
  setSpinnerVisible = false
};
