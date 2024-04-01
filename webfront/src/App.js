import './App.css';
import { RouterProvider, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import SignIn from './routes/signIn';
import SignUp from './routes/signUp';
import Dashboard from './routes/dashboard';
import Profile from './routes/profile';
import Historics from './routes/historics';
import Root from './routes/root';
import Home from './routes/home';
import { AuthProvider } from './auth/authProvider';
import ProtectedRoute from './routes/protectedRoute';

const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Root />} >
      <Route path="SignUp" element={<SignUp />} />
      <Route path="SignIn" element={<SignIn />} />
      <Route path="/" element={<ProtectedRoute />} >
        <Route path="Dashboard" element={ <Dashboard/> }/>
        <Route path="Profile" element={ <Profile/> }/>
        <Route path="Historics" element={ <Historics/>}/>
      </Route>
      <Route path="Home" element={ <Home/>}/>
    </Route>
));

function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router}/>
      </AuthProvider>
    </>
  );
}
export default App;
