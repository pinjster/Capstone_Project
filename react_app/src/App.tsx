import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import MainPage from "./pages/MainPage"
import SignInPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage"
import SignOutPage from "./pages/SignOutPage"
import MyProfilePage from "./pages/MyProfilePage"
import AboutPage from "./pages/AboutPage"
import MediaPage from "./pages/MediaPage"
import UserProfilePage from "./pages/UserProfilePage"


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <MainPage /> } />
        <Route path="/sign-in" element={ <SignInPage/> } />
        <Route path="/sign-up" element={ <SignUpPage/> } />
        <Route path="/sign-out" element={ <SignOutPage/> } />
        <Route path="/my-profile" element={ <MyProfilePage /> } />
        <Route path="/:username/profile" element={ <UserProfilePage /> } />
        <Route path="/about" element={ <AboutPage /> } />
        <Route path="/:type/:id" element={ <MediaPage /> } />
        <Route path="*" element={ <Navigate to="/" /> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
