import './App.css';
import { RouterProvider, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import SignIn from './routes/signIn.tsx';
import SignUp from './routes/signUp.tsx';
import Dashboard from './routes/dashboard';
import Profile from './routes/profile';
import Historics from './routes/historics';
import Root from './routes/root';
import { AuthProvider } from './auth/authProvider.tsx';
import ProtectedRoute from './routes/protectedRoute';
import { DataProvider } from './DataContext';
import Popup from './assets/popup.js';
const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Root />} >
      <Route path="SignUp" element={<SignUp />} />
      <Route path="SignIn" element={<SignIn />} />
      <Route path="/" element={<ProtectedRoute />} >
        <Route path="Dashboard" element={ <Dashboard/> }/>
        <Route path="Profile" element={ <Profile/> }/>
        <Route path="Historics" element={ <Historics/>}/>
      </Route>
    </Route>
));

function App() {
  return (
    <>
      <AuthProvider>
        <DataProvider>
          <RouterProvider router={router}/>
          <Popup />
        </DataProvider>
      </AuthProvider>
    </>
  );
}
export default App;
