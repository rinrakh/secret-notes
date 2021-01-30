import React, {useEffect} from 'react';
import Editor from 'react-markdown-editor-lite';
import ReactMarkdown from 'react-markdown';
import {useFormContext} from './FormContext';
import 'react-markdown-editor-lite/lib/index.css';

export default function MdEditor() {
  const [body, setBody] = useFormContext();

  useEffect(() => {}, []);

  const handleEditorChange = ({text}) => {
    const newValue = text;
    setBody(newValue);
  };

  return (
    <Editor
      value={body}
      name="note[body]"
      style={{
        height: '500px',
      }}
      onChange={handleEditorChange}
      renderHTML={(text) => <ReactMarkdown source={text} />}
    />
  );
}
