import './App.css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import GenerateQrCode from './qrCode';

function App() {
  return ( 
    <HashRouter>
      <div className="App">
        <Routes>
          <Route exact path="/" element={ <GenerateQrCode /> } />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
