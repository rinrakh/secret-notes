import React, {useEffect, useState} from 'react';
import NoteListItem from './NoteListItem';
import logo from './media/logo.svg'
import './Sidebar.scss'


export default function Sidebar() {
    const [notes, setNotes] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetch('/notes')
            .then(response => {
                if (!response.ok)
                    setError(response.statusText);
                return response.json()
            })
            .then((data) => {
                setNotes(data)
                setIsLoaded(true)
            })
    }, [])

    let noteList

    if (error != null) {
        noteList = <div>Error: {error}</div>
    } else if (!isLoaded) {
        noteList = <div>Loading...</div>
    } else {
        noteList = notes.map((note) => (
            <NoteListItem key={note.id} note={note} />
        ))
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
                    <input type="search" name="search" className="form-control" placeholder="Type a search.." />
                </section>
                <section id="note-list">
                    {noteList}
                </section>
                <section id="create-note" className="bg-light pt-3">
                    <button type="button" className="btn btn-primary btn-block w-100 mb-3 fw-bold">+ Add a note</button>
                </section>
            </section>
        </aside>
    );
}