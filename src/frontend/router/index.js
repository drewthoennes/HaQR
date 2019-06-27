import React from "react";
import {Switch, Route, BrowserRouter, Redirect} from 'react-router-dom';

import LoginPage from '@/containers/LoginPage';
import HackersPage from '@/containers/HackersPage';
import HackerPage from '@/containers/HackerPage';
import AdminPage from '@/containers/AdminPage';
import UnauthorizedPage from '@/containers/UnauthorizedPage';

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" render={() => <LoginPage/>}/>
        <Route exact path="/hackers" render={() => <HackersPage/>}/>
        <Route path="/hackers/:qr" render={() => <HackerPage/>}/>
        <Route path="/admin" render={() => <AdminPage/>}/>
        <Route path="/unauthorized" render={() => <UnauthorizedPage/>}/>
        <Route path="*" render={() => <Redirect to='/login'/>}/>
      </Switch>
    </BrowserRouter>
  );
};

export default Router;