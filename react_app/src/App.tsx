import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import MainPage from "./pages/MainPage"
import SignInPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage"
import SignOutPage from "./pages/SignOutPage"


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <MainPage /> } />
        <Route path="/sign-in" element={ <SignInPage/> } />
        <Route path="/sign-up" element={ <SignUpPage/> } />
        <Route path="/sign-out" element={ <SignOutPage/> } />
        <Route path="*" element={ <Navigate to="/" /> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
