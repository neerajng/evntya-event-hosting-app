import React from 'react';
import YellowDiv from '../../components/YellowDiv/YellowDiv';
import Evntya from '../../components/Evntya/Evntya';
import Welcome from '../../components/Welcome/Welcome';
import {Stack} from '@mui/material';
import { Outlet } from "react-router-dom"
export const WelcomeLayout = () => {
  console.log("welcome")
  return (
    <>
    <YellowDiv>
      <Stack direction="column" spacing={55}  pt={4} pl={6}>
      <Evntya />
      <Welcome />
      </Stack>
    </YellowDiv>
    <Outlet/>
    </>
  );
};
