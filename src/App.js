import TextEditor from "./TextEditor";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import Menu from "./components/Menu";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          {/* <Redirect to={`/documents/${uuidV4()}`} /> */}
          <Redirect to={`/document`} />
        </Route>
        <Route path="/document">
          <div className="folderContainer">
            <div className="editorFolder">
              <Menu />
              <TextEditor />
            </div>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
