import React, {useState, useEffect} from 'react';
import {useLocation} from './LocationContext';
import {useInput} from './hooks/input-hook';
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

export default function NoteItem() {
    const [location, setLocation] = useLocation();
    const [note, setNote] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [error, setError] = useState(null)
    const {value:title, bind:bindTitle, reset:resetTitle} = useInput('Untitled')
    const {value:body, bind:bindBody, reset:resetBody} = useInput('')

    useEffect(() => {
        if (null != location.selectedId) {
            fetch('/notes/' + location.selectedId)
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
    }, [location.selectedId]);

    async function handleSubmit(e) {
        e.preventDefault()
        fetch('/notes', {
            method: 'post',
            body: JSON.stringify({title: title, body: body}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then((result) => {
                if(result.ok) {
                    cancelEdit()
                }
            },
            (error) => {
                console.log(error);
            }
        )
    }

    function cancelEdit() {
        setLocation({isEditing: false, selectedId: null})
        resetTitle()
        resetBody()
    }

    let noteContent = <div>Select a note on the left sidebar..</div>
    if (location.isEditing) {
        noteContent = (
            <section id="note-item">
                <form onSubmit={handleSubmit}>
                    <header>
                        <div className="d-flex align-items-center">
                            <small className="fst-italic text-muted">Add a note</small>
                            <button type="submit" className="btn btn-success save-note">Save</button>
                            <button
                                type="button"
                                className="btn btn-light close-note"
                                onClick={cancelEdit}
                            >Cancel</button>
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
        noteContent = <div>Loading...</div>
    } else if (null != error) {
        noteContent = <div>Error: {error}</div>
    } else {
        if (null != location.selectedId && null != note && isLoaded) {
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
                                onClick={() => {
                                    setLocation({selectedId: null})
                                    setNote(null)
                                }}
                            >Close</button>
                        </div>
                        <h1 className="mt-4">{title}</h1>
                    </header>
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
            );
        }
    }

    return noteContent;
}