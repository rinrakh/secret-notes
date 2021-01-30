import React, {useEffect, useState} from 'react';
import {useLocation} from './LocationContext';
import NoteListItem from './NoteListItem';
import logo from './media/logo.svg';
import './Sidebar.scss';
import './Spinner.scss';

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const [notes, setNotes] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let url = '/notes';
    let timeOut = 0;

    if ('' !== location.searchText) {
      setIsLoaded(false);
      url = '/notes/s/' + location.searchText;
      timeOut = 500;
    }

    let query = setTimeout(() => {
      fetch(url)
        .then((res) => res.json())
        .then(
          (result) => {
            setIsLoaded(true);
            setNotes(result);
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        );
    }, timeOut);

    return () => clearTimeout(query);
  }, [location.isEditing, location.searchText]);
  // @TODO: prevent rerender sidebar when use notes action like edit/save/delete etc.

  let noteList;

  if (error != null) {
    noteList = <div>Error: {error}</div>;
  } else if (!isLoaded) {
    noteList = <div className="spinner"></div>;
  } else {
    noteList =
      notes.length > 0
        ? notes.map((note) => <NoteListItem key={note.id} note={note} />)
        : 'Cannot find note with text: "' + location.searchText + '"';
  }

  return (
    <aside id="sidebar" className="col flex-shrink-1 border-end bg-light">
      <section>
        <section id="logo" className=" h4 text-uppercase">
          <a href="/">
            <img src={logo} alt="Notes" />
            <span>Secret Notes</span>
          </a>
        </section>
        <section id="search" className="position-relative">
          <input
            type="search"
            name="search"
            className="form-control"
            placeholder="Type a search.."
            autoComplete="off"
            onChange={(e) => {
              setLocation({
                selectedId: location.selectedId,
                searchText: e.target.value,
              });
            }}
          />
        </section>
        <section id="note-list" className="text-center">
          {noteList}
        </section>
        <section id="create-note" className="bg-light pt-3">
          <button
            type="button"
            className="btn btn-primary btn-block w-100 mb-3 fw-bold"
            onClick={() => {
              setLocation({
                selectedId: null,
                isEditing: true,
                searchText: location.searchText,
              });
            }}>
            + Add a note
          </button>
        </section>
      </section>
    </aside>
  );
}
