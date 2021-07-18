import React from "react";
import routes from './routes';
import './App.css';
import {HashRouter} from "react-router-dom";

function App() {
  return (
      <HashRouter>
        <div className="App">
          <header className="header">
            <p>
              Wallet
            </p>
          </header>
          <main>{routes}</main>
        </div>
      </HashRouter>
  );
}

export default App;
