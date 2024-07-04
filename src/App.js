import './App.css';
import ParentRoute from './Components/Route/ParentRoute';
import ContextProvider from './Context/ContextProvider';
function App() {
  return (
    <div className="App">
      <ContextProvider>
        <ParentRoute/>
      </ContextProvider>
    </div>
  );
}

export default App;
