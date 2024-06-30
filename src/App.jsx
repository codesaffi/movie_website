import './assets/boxicons-2.0.7/css/boxicons.min.css';
import './App.scss';

// import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Header from './components/header/Header';
import Footer from './components/footer/Footer';

import Route1 from './config/Route1';

function App() {
    return (
        <Router>
        <Header />
        <Route1 />
        <Footer />
    </Router> 
    );
}

export default App;