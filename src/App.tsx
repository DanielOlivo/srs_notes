import { Navigate, Route, Routes } from 'react-router';
import './App.css'
import { Documents } from './documents/Documents';
import { NavBar } from './common/components/NavBar';

function App() {

  return (
    <div className='w-full h-full flex flex-col justify-start items-stretch p-0 m-0'>
      {/* <DbView /> */}
      {/* <CreateBasicNote /> */}
      <NavBar /> 
      <Routes>
        <Route path="docs" element={<Documents />} />
        {/* <Route path="notes" element={<Notes />} /> */}
        {/* <Route path="grid" element={<GridPage /> } /> */}
        {/* <Route path="grid/:gridId" element={<GridPage /> } /> */}
        <Route path="*" element={<Navigate to="docs" />} />
      </Routes>
    </div>
  );
}

export default App
