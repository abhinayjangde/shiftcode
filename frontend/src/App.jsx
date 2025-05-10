import {Routes, Route, Navigate} from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"

export default function App(){

  let authUser = null;

  return (
    <div className="flex flex-col items-center justify-start" >
      <Routes>

        <Route path="/" element={authUser ? <Home/> : <Navigate to={"/login"}/>} />
        <Route path="/login" element={!authUser ? <Login/> : <Navigate to={"/"}/> } />
        <Route path="/signup" element={!authUser ? <Signup/> : <Navigate to={"/"}/>  }/>

        <Route path="/problems" element={<h1>problems</h1>}/>

      </Routes>
    </div>
  )
}