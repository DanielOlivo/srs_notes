import { Navigate, Route, Routes } from 'react-router';
import './App.css'
import { Documents } from './documents/Documents';
import { NavBar } from './common/components/NavBar';
import { ListPage } from './List/components/ListPage/ListPage';
import { BasicNoteEdit } from './notes/components/BasicNoteEdit/BasicNoteEdit';
import { NoteEdit } from './notes/components/NoteEdit/NoteEdit';

function App() {

  return (
    <div className='w-full h-full flex flex-col justify-start items-stretch p-0 m-0'>
      <NavBar /> 
      <Routes>
        <Route path="docs" element={<Documents />} />
        <Route path="doc/:docId" element={<ListPage />}>
          <Route path="add" element={<NoteEdit />} />
        </Route>

        <Route path="*" element={<Navigate to="docs" />} />
      </Routes>
    </div>
  );
}

export default App
