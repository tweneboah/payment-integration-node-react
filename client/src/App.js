import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Receipt from './components/Payment/Receipt';
import Home from './components/Home';

const App = () => {
  return (
    <div className='App'>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/payment-success/:id' component={Receipt} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
