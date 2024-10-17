import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function MarkdownEditor({
    value,
    setValue,
    validate,
    id,
    register,
    height = 500,
    errors,
}) {
    const editorRef = useRef(null);

    return (
        <div className="flex flex-col ">
            {errors[id] && (
                <small className="text-xs text-red-500 text-end">
                    {errors[id].message}
                </small>
            )}
            <Editor
                apiKey={`${process.env.REACT_APP_TINY_MCE_KEY}`}
                onInit={(_evt, editor) => (editorRef.current = editor)}
                value={value}
                {...register(id, validate)}
                init={{
                    height,
                    menubar: true,
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
                }}
                onEditorChange={(content) => {
                    setValue(content);
                }}
            />
        </div>
    );
}
