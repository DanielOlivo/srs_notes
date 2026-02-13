import { Navigate, Route, Routes } from 'react-router';
import './App.css'
import { Documents } from './documents/Documents';
import { NavBar } from './common/components/NavBar';
import { ListPage } from './List/components/ListPage/ListPage';
import { MainLayout } from './common/components/MainLayout';
import { DocumentEditForm } from './documents/components/DocumentEditForm/DocumentEditForm';
import { NoteEdit } from './notes/components/NoteEdit/NoteEdit';
import { Settings } from './common/components/Settings/Settings';
import { About } from './common/components/About/About';
import { Development } from './common/components/Development/Development';

function App() {

  return (
    <div className='w-full h-full flex flex-col justify-start items-stretch p-0 m-0'>
      {/* <NavBar />  */}
      <Routes>
        <Route element={<MainLayout />}>
        {/* <Route path="docs" element={<Documents />} /> */}
          <Route path="docs">
            <Route index element={<Documents />} />
            <Route path="add" element={<DocumentEditForm />} />
            {/* <Route path="add/:position" element={<DocumentEditForm />} /> */}
            <Route path=":docId" element={<ListPage />} />
            <Route path=":docId/noteEdit/:noteId" element={<NoteEdit />} />
            <Route path=":docId/addNote/:posY/:posX" element={<NoteEdit />} />
            <Route path=":docId/edit" element={<DocumentEditForm />} />
          </Route>
          <Route path="settings" element={<Settings />} />
          <Route path="about" element={<About />} />
          <Route path="dev" element={<Development />} />
        </Route>
        {/* <Route path="doc/:docId" element={<ListPage />}> */}
          {/* <Route path="add" element={<NoteEdit />} /> */}
        {/* </Route> */}
        <Route path="*" element={<Navigate to="./docs" />} />
      </Routes>
    </div>
  );
}

export default App
