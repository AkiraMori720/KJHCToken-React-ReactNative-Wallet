import React from 'react'

import { Switch, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Wallet from "../pages/Wallet";


const routes = (
    <Switch>
        <Route path="/wallet" component={Wallet} />
        <Route path="/" component={Home} />
    </Switch>
)

export default routes
