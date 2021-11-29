import './bootstrap.min.css'
import './index.css'
import { Container } from 'react-bootstrap'
import Header from './components/Header'
import Homescreen from './screens/Homescreen'
import Web3 from 'web3'
import { Web3ReactProvider } from '@web3-react/core'
import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react'
import { BrowserRouter, BrowserRouter as Router, Route } from 'react-router-dom'
import Contract from './screens/Contract'
import Settings from './screens/Settings'
import Join from './screens/Join'

function getLibrary(provider) {
  return new Web3(provider)
}

function App() {
  return (

    <Router className="App">
      <Container>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Header />

         <main className="" style={{height:"100vh"}}>
        <Route path="/" component={Homescreen} exact />
        <Route path="/contract/:contractid" component={Contract} />
        <Route path="/settings" component={Settings} exact />
        <Route path="/join" component={Join} exact />



      </main>
        </ Web3ReactProvider>
      </Container>

      </Router>
  );
}

// export default App
export default withAuthenticator(App)
