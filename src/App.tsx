import Header from "./layout/Header";
import Spend from "./components/fearturs/Spend";
import Table from "./components/fearturs/SpendTable";
import Login from "./components/fearturs/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
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
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;