import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import Gallery from './components/Gallery';
import PictureDiscussion from './components/PictureDiscussion';
import './App.css'

/**
 * Main App component with routing and error boundary
 */
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Gallery />} />
            <Route path="/discussion/:id" element={<PictureDiscussion />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App
