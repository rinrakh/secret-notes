import React, {useState} from 'react';
import {useLocation} from './LocationContext';
import chevronUp from './media/chevron-up.svg'
import chevronDown from './media/chevron-down.svg'
import {format, isToday} from 'date-fns';
import excerpts from 'excerpts';
import marked from 'marked';

export default function NoteListItem({note}) {
    const [location, setLocation] = useLocation();
    const [isExpanded, setIsExpanded] = useState(false);
    let {id, title, body, updated_at} = note;
    const updatedAt = new Date(updated_at);
    const lastUpdatedAt = isToday(updatedAt)
        ? format(updatedAt, 'h:m bb')
        : format(updatedAt, 'd.M.yy');
    const summary = excerpts(marked(body), {words: 20});
    const isActive = id === location.selectedId;

    return(
        <div
            className={[
                'card my-3',
                isActive ? 'active' : '',
            ].join(' ')}
            onClick={() => setLocation({
                selectedId: id
            })}
        >
            <div className="card-body">
                <h3 className="note-title">
                    <span title={title}>{title}</span>
                    <button
                        type="button"
                        className="note-toggle"
                        title="Show preview"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(isExpanded ? false : true)
                        }}
                    >
                        <img src={isExpanded ? chevronUp : chevronDown} alt="" />
                    </button>
                </h3>
                <small className="note-date">{lastUpdatedAt}</small>
                <div className={[
                    'note-preview',
                    isExpanded ? 'show' : '',
                ].join(' ')}>
                    {summary || <i>No content</i>}
                </div>
            </div>
        </div>
    );
}