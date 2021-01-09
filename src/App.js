import {useState} from 'react';
import {LocationContext} from './LocationContext';
import Sidebar from './Sidebar';
import NoteItem from './NoteItem';
import './App.scss';

export default function App() {
  const [location, setLocation] = useState({
    selectedId: null,
  });

  return (
    <section className="wrapper container-fluid">
      <section className="row w-100">
        <LocationContext.Provider value={[location, setLocation]}>
          <Sidebar />
          <main
            id="content"
            // className="col h-100"
            className={[
              'col h-100',
              location.selectedId != null ? 'active' : '',
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
