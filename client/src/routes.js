import React from 'react'

import {Switch, Route,Redirect} from 'react-router-dom'
import AuthPage from './pages/Auth/AuthPage'
import {CreatePage} from './pages/Create/CreatePage'
import DetailPage from './pages/Detail/DetailPage'
import {LinksPage} from './pages/Links/LinksPage'
import {PlanePage} from './pages/Plane/plane'
import {AddCreditsPage} from './pages/addCredits/CreditsAdd'
import {BiletsPage} from './pages/myBilets/myBilets'


export const useRoutes = isAuthenticated =>{
    if(isAuthenticated){
        return(
            <Switch>
                <Route path="/addCredits" exact>
                    <AddCreditsPage />
                </Route>
                <Route path="/myBilets" exact>
                    <BiletsPage />
                </Route>
                <Route path="/links" exact>
                    <LinksPage />
                </Route>
                <Route path="/create" exact>
                    <CreatePage />
                </Route>
                <Route path="/plane/all" exact>
                    <PlanePage />
                </Route>
                <Route path="/detail/:id" exact>
                    <DetailPage />
                </Route>
                
                <Redirect to="/plane/all" />
            </Switch>
        )
    }

    return(
         <Switch>
            <Route path="/" exact>
                <AuthPage />
            </Route>
            <Redirect to="/" />
         </Switch>
    )
}   