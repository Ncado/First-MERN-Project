import { useRoutes } from './routes';
import { BrowserRouter as Router } from 'react-router-dom';
import React, { useContext } from 'react';
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/AuthContext'
import {Loader} from './components/Loader/Loader';
import {Navbar} from './components/navbar'

function App() {
	const {token, login, logout, userId, ready} = useAuth()
	const isAuthenticated = !!token
	const routes = useRoutes(isAuthenticated)
	if(!ready){
		return (<loader />);
	}
	return (
		<AuthContext.Provider value={{ token, login, logout, userId, isAuthenticated }}>
			<Router>
				<div className="App">
				{ isAuthenticated && <Navbar /> }
					{routes}
				</div>
			</Router> 
		</AuthContext.Provider>
	);
}

export default App;
