import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useGithub } from "./githubContext";
import SharedPage from "./components/ShareSketch";
import { database } from "../firebaseConfig";
import { ThemeProvider } from "./themeContext";

const MainApplication = React.lazy(() =>
  import("./components/SketchGallery")
);
const GithubAuth = React.lazy(() =>
  import("./components/GitHubAuth/index")
);
const EditPage = React.lazy(() =>
  import("./components/EhsaanDrawSketch/index")
);

function App() {
  const { githubId } = useGithub();

  return (
    <>
      <ThemeProvider>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route
                path="/"
                element={
                  githubId ? <MainApplication /> : <Navigate to="/login" />
                }
              />
              <Route path="/login" element={<GithubAuth />} />
              <Route path="/edit/:id" element={<EditPage />} />
              <Route
                path="/shared/:shareId"
                element={<SharedPage database={database} />}
              />
            </Routes>
          </Suspense>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
