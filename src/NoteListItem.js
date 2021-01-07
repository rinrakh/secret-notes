import React, {useState} from 'react';
// import chevronUp from './media/chevron-up.svg'
import chevronDown from './media/chevron-down.svg'
import {format, isToday} from 'date-fns';
import excerpts from 'excerpts';
import marked from 'marked';

export default function NoteListItem({note}) {
    const [isExpanded, setIsExpanded] = useState(false)
    const updatedAt = new Date(note.updated_at);
    const lastUpdatedAt = isToday(updatedAt)
        ? format(updatedAt, 'h:m bb')
        : format(updatedAt, 'd/M/yy');
    const summary = excerpts(marked(note.body), {words: 20});

    function togglePreview() {
        setIsExpanded(isExpanded ? false : true)
    }

    return(
        <div className="card my-3">
            <div className="card-body">
                <h3 className="note-title">
                    <span title={note.title}>{note.title}</span>
                    <button type="button" className="note-toggle" onClick={togglePreview}>
                        <img src={chevronDown} alt={note.title} />
                    </button>
                </h3>
                <small className="note-date">{lastUpdatedAt}</small>
                <div className={`note-preview ${isExpanded ? 'show' : ''}`}>{summary || <i>No content</i>}</div>
            </div>
        </div>
    );
}