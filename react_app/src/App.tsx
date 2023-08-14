import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import MainPage from "./pages/MainPage"


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <MainPage /> } />
        <Route path="/" element={ <></> } />
        <Route path="*" element={ <Navigate to="/" /> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
