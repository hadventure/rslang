import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Navigation from './components/navigation/navigation';
import WordGroupList from './components/word-group-list/word-group-list';
import WordList from './components/word-list/word-list';

function App() {
  return (
    <BrowserRouter basename="/">
      <Navigation />
      <Routes>
        <Route path="/" element={<div>Main</div>} />
        <Route path="tutorials">
          <Route index element={<WordGroupList />} />
          <Route path=":tutorial" element={<WordList />} />
        </Route>

        <Route path="/statistics" element={<div>Statistics</div>} />
        <Route path="/auth" element={<div>Auth</div>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
