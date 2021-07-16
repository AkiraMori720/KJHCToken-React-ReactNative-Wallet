import React from "react";
import routes from './routes';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="header">
        <p>
          Wallet
        </p>
      </header>
      <main>{routes}</main>
    </div>
  );
}

export default App;
