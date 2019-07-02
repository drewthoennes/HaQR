import React from "react";
import {Switch, Route, Router, Redirect} from 'react-router-dom';
import history from './history';

import LoginPage from '@/containers/LoginPage';
import HackersPage from '@/containers/HackersPage';
import HackerPage from '@/containers/HackerPage';
import AdminPage from '@/containers/AdminPage';
import UnauthorizedPage from '@/containers/UnauthorizedPage';

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