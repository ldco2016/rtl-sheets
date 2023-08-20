import "bulmaswatch/superhero/bulmaswatch.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import * as ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./state";
import CellList from "./components/cell-list";

// 2) Get a reference to the div with ID root
const el = document.getElementById("root");

// 3) Tell React to take control of that element
const root = ReactDOM.createRoot(el!);

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <CellList />
      </div>
    </Provider>
  );
};

root.render(<App />);
