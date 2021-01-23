import React, {useState, useEffect} from 'react';
import {useLocation} from './LocationContext';
import {useInput} from './hooks/input-hook';
import {format} from 'date-fns';
import marked from 'marked';
import sanitizeHtml from 'sanitize-html';
// import cross from './media/cross.svg'
import './NoteItem.scss';
const allowedTags = sanitizeHtml.defaults.allowedTags.concat([
  'img',
  'h1',
  'h2',
  'h3',
]);
const allowedAttributes = Object.assign(
  {},
  sanitizeHtml.defaults.allowedAttributes,
  {
    img: ['alt', 'src'],
  }
);

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

  async function handleSubmit(e) {
    e.preventDefault();
    let url = location.selectedId ? '/notes/' + location.selectedId : '/notes';
    let method = location.selectedId ? (isDeleting ? 'delete' : 'put') : 'post';
    fetch(url, {
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
  }

  function resetForm() {
    resetTitle();
    resetBody();
  }

  let noteContent = <div>Select a note on the left sidebar..</div>;
  // @TODO: write edit func for existing note
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
      <section id="note-item">
        <form onSubmit={handleSubmit}>
          <header>
            <div className="row d-flex align-items-center">
              <div
                className="
                                col-12 
                                col-lg 
                                flex-lg-shrink-1 
                                h-100 mb-3 mb-xl-0
                            ">
                <small className="fst-italic text-muted">
                  {location.selectedId ? 'Edit note' : 'Add a note'}
                </small>
              </div>
              <div
                className="
                                col-12 
                                col-lg 
                                flex-lg-grow-1
                                justify-content-md-between 
                                justify-content-lg-end 
                                text-center
                                d-flex
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
          <article className="mt-4">
            <textarea
              name="note[body]"
              className="form-control border-0 bg-light"
              placeholder="Set note body"
              value={body}
              {...bindBody}
            />
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
      let {title, body, updated_at} = note;
      const updatedAt = new Date(updated_at);
      const lastUpdatedAt = format(updatedAt, "d MMM yyyy 'at' h:mm bb");

      noteContent = (
        <section id="note-item">
          <header>
            <div className="row d-flex align-items-center">
              <div
                className="
                                col-12 
                                col-lg 
                                flex-lg-shrink-1 
                                h-100 mb-3 mb-xl-0
                            ">
                <small className="fst-italic text-muted">
                  Last updated at: {lastUpdatedAt}
                </small>
              </div>
              <div
                className="
                                col-12 
                                col-lg 
                                flex-lg-grow-1
                                justify-content-md-between 
                                justify-content-lg-end 
                                text-center
                                d-flex
                            ">
                <button
                  type="button"
                  className="btn btn-primary edit-note"
                  onClick={() => {
                    setLocation({
                      isEditing: true,
                      selectedId: location.selectedId,
                      searchText: location.searchText,
                    });
                  }}>
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-light close-note"
                  onClick={() => {
                    setLocation({
                      isEditing: false,
                      selectedId: null,
                      searchText: location.searchText,
                    });
                    resetForm();
                  }}>
                  Close
                </button>
              </div>
            </div>
            <h1 className="mt-4">{title}</h1>
          </header>
          <article
            className="mt-4"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(marked(body), {
                allowedTags,
                allowedAttributes,
              }),
            }}
          />
        </section>
      );
    }
  }

  return noteContent;
}
