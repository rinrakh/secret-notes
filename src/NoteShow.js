import {useLocation} from './LocationContext';
import marked from 'marked';
import sanitizeHtml from 'sanitize-html';
import {format} from 'date-fns';

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

export default function NoteShow({note}) {
  const [location, setLocation] = useLocation();
  let {title, body, updated_at} = note;
  const updatedAt = new Date(updated_at);
  const lastUpdatedAt = format(updatedAt, "d MMM yyyy 'at' h:mm bb");

  return (
    <section id="note-show" className="note-item h-100">
      <header>
        <div className="row d-flex align-items-center">
          <div className="col-12 col-lg flex-lg-shrink-1 h-100 mb-3 mb-xl-0">
            <small className="fst-italic text-muted">
              Last updated at: {lastUpdatedAt}
            </small>
          </div>
          <div
            className="col-12 col-lg flex-lg-grow-1 justify-content-md-between 
            justify-content-lg-end text-center d-flex
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
