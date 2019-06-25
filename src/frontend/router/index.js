import React from "react";
import {Switch, Route, BrowserRouter, Redirect} from 'react-router-dom';

import HackersPage from '@/containers/HackersPage';
import LoginPage from '@/containers/LoginPage';

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" render={() => <LoginPage/>}/>
        <Route path="/hackers" render={() => <HackersPage/>}/>
        <Route path="*" render={() => <Redirect to='/login'/>}/>
      </Switch>
    </BrowserRouter>
  );
};

export default Router;