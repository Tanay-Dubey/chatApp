import React from "react";
import { BrowserRouter as Router, Route, Routes,useLocation} from "react-router-dom";
import Join from "./components/Join/Join";
import Chat from "./components/Chat/Chat";


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" exact element={<Join/>}></Route>
                <Route path="/chat" element={<Chat location={useLocation}/>}></Route>
            </Routes>
        </Router>
    )
};
//exact attribute is used for exact matching of URL


export default App;