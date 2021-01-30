import {useState} from 'react';
import {LocationContext} from './LocationContext';
import Sidebar from './Sidebar';
import NoteItem from './NoteItem';
import './App.scss';

export default function App() {
  // @TODO: refactor useContext, save params somewhere for less code when use setLocation
  const [location, setLocation] = useState({
    selectedId: null,
    isEditing: null,
    searchText: '',
  });

  return (
    <section className="wrapper container-fluid">
      <section className="row w-100 flex-nowrap">
        <LocationContext.Provider value={[location, setLocation]}>
          <Sidebar />

          <main
            id="content"
            className={[
              'col h-100',
              location.selectedId != null || location.isEditing ? 'active' : '',
            ].join(' ')}>
            <section className="content-inner">
              <NoteItem />
            </section>
          </main>
        </LocationContext.Provider>
      </section>
    </section>
  );
}
