import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { CircularProgress } from '@material-ui/core'

const Checkout = lazy(() => import('./view/checkout'))
const Card = lazy(() => import('./view/checkout/card'))
const Boleto = lazy(() => import('./view/checkout/boleto'))
const Picpay = lazy(() => import('./view/checkout/picpay'))
const TransactionShow = lazy(() => import('./view/transactions/show'))

const Routes = () => (
    <Router>
        <Suspense fallback={<div className="d-flex justify-content-center mt-5 pt-5"> <CircularProgress/> </div>}>
            <Switch>
                <Route exact path="/card" component={Card} />
                <Route exact path="/boleto" component={Boleto} />
                <Route exact path="/picpay" component={Picpay} />
                <Route exact path="/charge/:id" component={TransactionShow} />
                <Route exact path="/" component={Checkout} />
            </Switch>
        </Suspense>
    </Router>
)

export default Routes;