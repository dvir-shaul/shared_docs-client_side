import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import DocumentPage from "./components/DocumentPage";
import { useGetTokenFromLocalStorage } from "./customHooks/useGetTokenFromLocalStorage";
import Activation from "./components/Activation";

function App() {
  const [activeMainFolder, setActiveMainFolder] = useState();
  const [activeDocument, setActiveDocument] = useState();
  const [email, setEmail] = useState("");
  const token = useState(useGetTokenFromLocalStorage());

  return (
    <Router>
      <Switch>
        <Route path="/register">
          <Register email={email} setEmail={setEmail} />
        </Route>
        <Route path="/login">
          <Login email={email} setEmail={setEmail} />
        </Route>
        <Route path="/document/share/:documentId&:userId">
          <DocumentPage
            activeMainFolder={activeMainFolder}
            setActiveMainFolder={setActiveMainFolder}
            activeDocument={activeDocument}
            setActiveDocument={setActiveDocument}
          />
        </Route>
        <Route path="/activate/:token">
          <Activation />
        </Route>
        <Route path="/document/share/:documentId">
          <DocumentPage
            activeMainFolder={activeMainFolder}
            setActiveMainFolder={setActiveMainFolder}
            activeDocument={activeDocument}
            setActiveDocument={setActiveDocument}
          />
        </Route>
        <Route path="/document">
          <DocumentPage
            activeMainFolder={activeMainFolder}
            setActiveMainFolder={setActiveMainFolder}
            activeDocument={activeDocument}
            setActiveDocument={setActiveDocument}
          />
        </Route>
        {/* <Route path="/">
          {token !== null && token.length > 0 ? (
            <Redirect to={`/document`} />
          ) : (
            <Redirect to={"/login"} />
          )}
        </Route> */}
      </Switch>
    </Router>
  );
}

export default App;
