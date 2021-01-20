import React, {useEffect, useState} from 'react';
import {useLocation} from './LocationContext'
import NoteListItem from './NoteListItem';
import logo from './media/logo.svg'
import './Sidebar.scss'


export default function Sidebar() {
    const [location, setLocation] = useLocation();
    const [notes, setNotes] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/notes')
            .then(res => res.json())
            .then((result) => {
                    setIsLoaded(true);
                    setNotes(result);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [location.isEditing]);

    let noteList;

    if (error != null) {
        noteList = <div>Error: {error}</div>;
    } else if (!isLoaded) {
        noteList = <div>Loading...</div>;
    } else {
        noteList = notes.map((note) => (
            <NoteListItem key={note.id} note={note} />
        ));
    }

    return(
        <aside id="sidebar" className="col flex-shrink-1 border-end bg-light">
            <section>
                <section id="logo" className=" h4 text-uppercase">
                    <a href="/">
                        <img src={logo} alt="Notes" />
                        <span>Secret Notes</span>
                    </a>
                </section>
                <section id="search">
                    {/* @TODO: write search component */}
                    <input type="search" name="search" className="form-control" placeholder="Type a search.." />
                </section>
                <section id="note-list">
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
                            })
                        }}
                    >
                        + Add a note
                    </button>
                </section>
            </section>
        </aside>
    );
}