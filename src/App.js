import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import './App.css';
import Home from './pages/home/home';
import Login from './pages/login/login';
import Register from './pages/register/register';
import PageNotFound from './pages/notFound/notFound';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="*" element={<PageNotFound />}/>
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
