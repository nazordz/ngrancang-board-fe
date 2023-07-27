import { Editor } from "@tinymce/tinymce-react";
import React, { useRef } from "react";
import { Editor as TinyMCEEditor, TinyMCE } from "tinymce";

type EditorOptions = Parameters<TinyMCE['init']>[0];
export interface RichEditorProps {
  initialValue: string;
  onChange: (a: string) => void;
  init?: EditorOptions & {
      selector?: undefined;
      target?: undefined;
  }

}

const defaultProps: RichEditorProps = {
  initialValue: "",
  onChange: (a) => {},
  init: {
    height: 200,
    menubar: false,
    plugins: [
      "advlist",
      "autolink",
      "lists",
      "link",
      "image",
      "charmap",
      "preview",
      "anchor",
      "searchreplace",
      "visualblocks",
      "code",
      "fullscreen",
      "insertdatetime",
      "media",
      "table",
      "code",
      "help",
      "wordcount",
    ],
    toolbar:
      "undo redo | blocks | " +
      "bold italic forecolor | alignleft aligncenter " +
      "alignright alignjustify | bullist numlist outdent indent | " +
      "removeformat | help",
    content_style:
      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
  }
};

const RichEditor: React.FC<RichEditorProps> = (props) => {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  function onEditorChange(a: string, editor: TinyMCEEditor) {
    props.onChange(a);
  }
  return (
    <Editor
      apiKey={import.meta.env.VITE_TINYMCE_KEY}
      onInit={(evt, editor) => (editorRef.current = editor)}
      initialValue={props.initialValue}
      onEditorChange={onEditorChange}
      init={props.init}
    />
  );
};

RichEditor.defaultProps = defaultProps;

export default RichEditor;
