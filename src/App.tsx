import Header from "./layout/Header";
import Spend from "./components/fearturs/Spend";
import Table from "./components/fearturs/SpendTable";
import Login from "./components/fearturs/Login";
import Signup from "./components/fearturs/SignUp";
import ProfileView from "./components/fearturs/ProfileView";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
// import ProtectedRoute from "./routes/ProtectedRoute";


const App = () => {

  const [userData, setUserData] = useState<User | null>(null)


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserData(user)
    })

    return () => unsubscribe()
  }, [])



  return (
    <BrowserRouter>
      <Toaster position="top-center" />

      <Header />

      <main className="pt-20 m-9">
        <Routes>

          {/* Redirect root based on auth */}
          <Route
            path="/"
            element={
              userData ? (
                <>
                  <Spend />
                  <Table />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Login */}
          <Route
            path="/login"
            element={!userData ? <Login /> : <Navigate to="/" />}
          />

          {/* Signup */}
          <Route
            path="/signup"
            element={!userData ? <Signup /> : <Navigate to="/" />}
          />

          {/* Protected Profile */}
          <Route
            path="/profile"
            element={userData ? <ProfileView /> : <Navigate to="/login" />}
          />

        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;