import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Transactions from "./pages/Transactions";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AuthenticatedRoute from "./components/Auth/AuthenticatedRoute";
import LoadingScreen from "./components/Loading/LoadingScreen";
import { Notifier } from "./components/Notifier";
import { FC } from "react";

const App: FC = () => {
  return (
    <div className="main">
      <LoadingScreen />
      <Notifier />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={
            <AuthenticatedRoute>
              <Login />
            </AuthenticatedRoute>} />
          <Route path="/transactions" element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          } />
          <Route path="*" element={
            <AuthenticatedRoute>
              <Login />
            </AuthenticatedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;