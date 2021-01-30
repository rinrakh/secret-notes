import React, {useState, useEffect} from 'react';
import {useLocation} from './LocationContext';
import {FormContext} from './FormContext';
import NoteShow from './NoteShow';
import {useInput} from './hooks/input-hook';
import Editor from './NoteEditor';
import './NoteItem.scss';

// @TODO: refactor NoteItem for readable code
export default function NoteItem() {
  const [location, setLocation] = useLocation();
  const [note, setNote] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDeleting, deleteNote] = useState(false);
  const [error, setError] = useState(null);
  const {
    value: title,
    set: setTitle,
    bind: bindTitle,
    reset: resetTitle,
  } = useInput('Untitled');
  const {
    value: body,
    set: setBody,
    bind: bindBody,
    reset: resetBody,
  } = useInput('');

  useEffect(() => {
    if (null != location.selectedId) {
      fetch('/notes/' + location.selectedId)
        .then((res) => res.json())
        .then(
          (result) => {
            setIsLoaded(true);
            setNote(result);
            if (location.isEditing) {
              setTitle(result.title);
              setBody(result.body);
            } else {
              resetForm();
            }
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        );
    } else {
      resetForm();
    }
  }, [location.selectedId, location.isEditing]);

  function handleSubmit(e) {
    e.preventDefault();
    let url = location.selectedId ? '/notes/' + location.selectedId : '/notes';
    let method = location.selectedId ? (isDeleting ? 'delete' : 'put') : 'post';
    const fetchData = async () => {
      await fetch(url, {
        method: method,
        body: JSON.stringify({title: title, body: body}),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then(
          (result) => {
            if (result.ok) {
              if (location.selectedId && !isDeleting) {
                setLocation({
                  isEditing: false,
                  selectedId: location.selectedId,
                  searchText: location.searchText,
                });
              } else if (isDeleting || null == location.selectedId) {
                setLocation({
                  isEditing: false,
                  selectedId: null,
                  searchText: location.searchText,
                });
                resetForm();
                deleteNote(false);
              }
            }
          },
          (error) => {
            // @TODO: throw error message
            console.log(error);
          }
        );
    };
    fetchData();
  }

  function resetForm() {
    resetTitle();
    resetBody();
  }

  let noteContent = <div>Select a note on the left sidebar..</div>;
  if (location.isEditing) {
    let deleteButton = (
      <button
        type="submit"
        className="btn btn-danger delete-note"
        onClick={() => {
          deleteNote(true);
        }}>
        Delete
      </button>
    );
    noteContent = (
      <section id="note-edit" className="note-item h-100">
        <form
          onSubmit={handleSubmit}
          className="d-flex flex-wrap h-100 position-relative">
          <header className="w-100">
            <div className="row d-flex align-items-center">
              <div className="col-12 col-lg flex-lg-shrink-1 h-100 mb-3 mb-xl-0">
                <small className="fst-italic text-muted">
                  {location.selectedId ? 'Edit note' : 'Add a note'}
                </small>
              </div>
              <div
                className="
                col-12 col-lg flex-lg-grow-1
                justify-content-md-between 
                justify-content-lg-end text-center d-flex
              ">
                <button type="submit" className="btn btn-primary save-note">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-light close-note"
                  onClick={() => {
                    setLocation({
                      isEditing: false,
                      selectedId: location.selectedId,
                      searchText: location.searchText,
                    });
                    resetForm();
                  }}>
                  Cancel
                </button>
                {null != location.selectedId ? deleteButton : ''}
              </div>
            </div>
            <h1 className="mt-4">
              <input
                type="text"
                name="note[title]"
                className="form-control border-0 bg-light"
                placeholder="Set note title"
                value={title}
                {...bindTitle}
              />
            </h1>
          </header>
          <article className="w-100 h-75 my-4">
            <FormContext.Provider value={[body, setBody]}>
              <Editor />
            </FormContext.Provider>
          </article>
        </form>
      </section>
    );
  } else if (null != location.selectedId && !isLoaded) {
    noteContent = <div>Loading...</div>;
  } else if (null != error) {
    noteContent = <div>Error: {error}</div>;
  } else {
    if (null != location.selectedId && null != note && isLoaded) {
      noteContent = <NoteShow note={note} />;
    }
  }

  return noteContent;
}
