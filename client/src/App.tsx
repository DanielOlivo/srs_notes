import { Navigate, Route, Routes } from 'react-router';
import './App.css'
import { Documents } from './documents/Documents';
import { NavBar } from './common/components/Navbar/NavBar';
import { ListPage } from './List/components/ListPage/ListPage';
import { MainLayout } from './common/components/MainLayout';
import { DocumentEditForm } from './documents/components/DocumentEditForm/DocumentEditForm';
import { NoteEdit } from './notes/components/NoteEdit/NoteEdit';
import { Settings } from './common/components/Settings/Settings';
import { About } from './common/components/About/About';
import { Development } from './common/components/Development/Development';
import { BackupPage } from './common/components/BackupPage/BackupPage';
import { TrashedDocumentList } from './documents/components/TrashedDocumentList/TrashedDocumentList';
import { DocumentConfig } from './documents/components/DocumentConfig/DocumentConfig';

function App() {

  return (
    <div className='w-full h-screen flex flex-col justify-start items-stretch p-0 m-0'>
      {/* <NavBar />  */}
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="docs">
            <Route index element={<Documents />} />
            <Route path="add" element={<DocumentEditForm />} />
            <Route path=":docId" element={<ListPage />} />
            <Route path=":docId/config" element={<DocumentConfig />} />
            <Route path=":docId/noteEdit/:noteId" element={<NoteEdit />} />
            <Route path=":docId/addNote" element={<NoteEdit />} />
            <Route path=":docId/addNote/:posY/:posX" element={<NoteEdit />} />
            <Route path=":docId/edit" element={<DocumentEditForm />} />
          </Route>
          <Route path="docs/trash" element={<TrashedDocumentList />}/>
          <Route path="settings" element={<Settings />} />
          <Route path="about" element={<About />} />
          <Route path="dev" element={<Development />} />
          <Route path="backup" element={<BackupPage />} />
        </Route>
        <Route path="*" element={<Navigate to="./docs" replace/>} />
      </Routes>
    </div>
  );
}

export default App
