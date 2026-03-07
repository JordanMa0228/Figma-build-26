import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Sessions from './pages/Sessions'
import SessionDetail from './pages/SessionDetail'
import Trends from './pages/Trends'
import Compare from './pages/Compare'
import Settings from './pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="sessions/:id" element={<SessionDetail />} />
          <Route path="trends" element={<Trends />} />
          <Route path="compare" element={<Compare />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
