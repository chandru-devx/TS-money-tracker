import Header from "./layout/Header";
import Spend from "./components/fearturs/Spend";
import Table from "./components/fearturs/SpendTable";
import Login from "./components/fearturs/Login";
import Signup from "./components/fearturs/SignUp";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
    
      <Header />

      <main className="pt-20 m-9">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Spend />
                <Table />
              </>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup/>}/>
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;