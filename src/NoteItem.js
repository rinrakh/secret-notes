import React, {useState, useEffect} from 'react';
import {format} from 'date-fns';
import marked from 'marked';
import sanitizeHtml from 'sanitize-html';
// import cross from './media/cross.svg'
import './NoteItem.scss'
const allowedTags = sanitizeHtml.defaults.allowedTags.concat([
    'img', 'h1', 'h2', 'h3',
]);
const allowedAttributes = Object.assign(
    {},
    sanitizeHtml.defaults.allowedAttributes,
    {
        img: ['alt', 'src'],
    }
);

export default function NoteItem({loc, asd}) {
    let noteId = loc.selectedId;
    const [note, setNote] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (null !== noteId) {
            fetch('/notes/' + noteId)
                .then(res => res.json())
                .then((result) => {
                        setIsLoaded(true);
                        setNote(result);
                    },
                    (error) => {
                        setIsLoaded(true);
                        setError(error);
                    }
                )
        }
    }, [noteId]);

    // @TODO: close a note and force update this func NoteItem
    function handleClick() {
        noteId = null;
        loc.selectedId = null;
    }

    let noteContent = <div>Select a note on the left sidebar..</div>
    if (null !== noteId && !isLoaded) {
        noteContent = <div>Loading...</div>
    } else if (null !== error) {
        noteContent = <div>Error: {error}</div>
    } else {
        if (null !== note) {
            let {title, body, updated_at} = note;
            const updatedAt = new Date(updated_at);
            const lastUpdatedAt = format(updatedAt, "d MMM yyyy 'at' h:mm bb");
            noteContent = (
                <section id="note-item">
                    <header>
                        <div className="d-flex align-items-center">
                            <small>Last updated at: {lastUpdatedAt}</small>
                            <button type="button" className="btn btn-primary edit-note">Edit</button>
                            <button
                                type="button"
                                className="btn btn-danger close-note"
                                onClick={handleClick}
                            >Close</button>
                        </div>
                        <h1 className="mt-4">{title}</h1>
                    </header>
                    {/* <article className="mt-4">{marked(body)}</article> */}
                    <article
                        className="mt-4"
                        dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(marked(body), {
                                allowedTags,
                                allowedAttributes,
                            })
                        }}
                    />
                </section>
            )
        }
    }

    return noteContent;
}