import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Chatbot from "./components/Chatbot";
import MyPacks from "./components/MyPacks";
import Login from "./components/Login";
import Signup from "./components/Signup";
import "./styles/global.css"; // Global styles
import FloatingHearts from "../src/components/FloatingHearts";
import FreshMornings from "./components/FreshMornings";
import CalmMind from "./components/CalmMind";
import SleepSounds from "./components/SleepSounds"; 
import SleepStories from "./components/SleepStories";
import EssentialWellness from "./components/EssentialWellness";
import AngerManage from "./components/AngerManage";




function App() {
  return (
    <Router>
      
      <Navbar />
      <FloatingHearts />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
       <Route path="/Chatbot" element={<Chatbot />} />
        <Route path="/mypacks" element={<MyPacks />} />
        <Route path="/fresh-mornings"    element={<FreshMornings />} />
        <Route path="/calm-mind" element={<CalmMind />} />
        <Route path="/sleep-sounds" element={<SleepSounds />} />
        <Route path="/sleep-stories" element={<SleepStories />} />
        <Route path="/essential-wellness" element={<EssentialWellness/>} />
        <Route path="/manage-anger" element={<AngerManage />} />
        
      </Routes>
    </Router>
  );
}

export default App;