import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Sender } from './components/Sender.tsx'
import { Receiver } from './components/Receiver.tsx'


function App() {

  return (
  <BrowserRouter>
      <Routes>
        <Route path='/sender' element={<Sender />} />
        <Route path='/receiver' element={<Receiver />} />
      </Routes>
  </BrowserRouter>
  )
}

export default App
