import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Layout>
          {" "}
          {/* Keep Layout always active */}
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
