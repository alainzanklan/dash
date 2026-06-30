import React, { useEffect, useState } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { ControllerRenderProps } from 'react-hook-form';
import draftToHtml from 'draftjs-to-html';
import DOMPurify from "dompurify"
import dynamic from 'next/dynamic';
import { EditorProps } from 'react-draft-wysiwyg';
import {stateToHTML} from "draft-js-export-html"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import htmlToDraft from 'html-to-draftjs';


interface Props {
  field: ControllerRenderProps<any, any>;
}

const Editor = dynamic<EditorProps>(
    () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
    { ssr: false }
  );


const WysiwygEditor: React.FC<Props> = ({ field }) =>  {
  const [editorState, setEditorState] = useState<EditorState>( () => {
  if (field.value) {
    const blocksFromHtml = htmlToDraft(field.value);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    const _editorState = EditorState.createWithContent(contentState);
    return _editorState
  } else {
  return EditorState.createEmpty() }
  })
  
  

  useEffect(() => {
    const rawContent = convertToRaw(editorState.getCurrentContent());
    const htmlContent = draftToHtml(rawContent);
    const cleanHtml = DOMPurify.sanitize(htmlContent)
    field.onChange(cleanHtml);
  }, [editorState]);

  const onEditorStateChange  = (newEditorState: any) => {
    setEditorState(newEditorState);
  };

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName="editorClassName"
     />
  );
};

export default WysiwygEditor;
