import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function MarkdownEditor({
    label,
    value,
    changeValue,
    name,
    invalidFields,
    setInvalidFields,
    validate,
    id,
    register,
    height = 500,
    errors,
}) {
    const editorRef = useRef(null);

    const log = () => {
        if (editorRef.current) {
            console.log(editorRef.current.getContent());
        }
    };

    return (
        <div className="flex flex-col ">
            {/* <div className="flex gap-4">
                <span>{label}</span>
                {invalidFields?.some((el) => el.name === name) && (
                    <small className="text-red-600">
                        {invalidFields?.find((el) => el.name === name)?.message}
                    </small>
                )}
            </div> */}
            {errors[id] && (
                <small className="text-xs text-red-500 text-end">
                    {errors[id].message}
                </small>
            )}
            <Editor
                apiKey={`${process.env.REACT_APP_TINY_MCE_KEY}`}
                onInit={(_evt, editor) => (editorRef.current = editor)}
                initialValue={value}
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
                // onChange={(e) =>
                //     changeValue((prev) => ({
                //         ...prev,
                //         [name]: e.target.getContent(),
                //     }))
                // }
                // onFocus={() => setInvalidFields && setInvalidFields([])}
            />
        </div>
    );
}
