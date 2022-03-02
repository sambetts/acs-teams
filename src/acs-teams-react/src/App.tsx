import React from 'react';

import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout } from './Layout';
import { Home } from './components/Home';
import './custom.css'

function App() {
  return (
    <div>
      <Layout>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
