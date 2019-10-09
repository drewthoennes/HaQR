import React from "react";
import {Switch, Route, Router, Redirect} from 'react-router-dom';
import history from './history';

import LoginPage from '@f/containers/LoginPage';
import HackersPage from '@f/containers/HackersPage';
import HackerPage from '@f/containers/HackerPage';
import AdminPage from '@f/containers/AdminPage';
import UnauthorizedPage from '@f/containers/UnauthorizedPage';

const router = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/login" render={() => <LoginPage/>}/>
        <Route exact path="/hackers" render={() => <HackersPage/>}/>
        <Route path="/hackers/:qr" render={() => <HackerPage/>}/>
        <Route path="/admin" render={() => <AdminPage/>}/>
        <Route path="/unauthorized" render={() => <UnauthorizedPage/>}/>
        <Route path="*" render={() => <Redirect to='/login'/>}/>
      </Switch>
    </Router>
  );
};

export default router;
