"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import { useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  ImagePlus,
  Italic,
  List,
  ListOrdered,
  Redo2,
  Undo2,
} from "lucide-react";

type ContenidoEditorProps = {
  name: string;
  initialContent?: string;
};

export default function ContenidoEditor({
  name,
  initialContent = "",
}: ContenidoEditorProps) {
  const [html, setHtml] = useState(initialContent);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextStyle,
      Image.configure({
        allowBase64: false,
        HTMLAttributes: {
          class:
            "mx-auto my-6 h-auto max-w-full rounded-2xl object-contain",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "min-h-[500px] px-6 py-5 text-slate-900 outline-none prose prose-slate max-w-none",
      },
    },
    onUpdate({ editor }) {
      setHtml(editor.getHTML());
    },
  });

  function insertarImagen() {
    const url = window.prompt("Pega aquí la URL de la imagen de Cloudinary:");

    if (!url || !editor) {
      return;
    }

    editor.chain().focus().setImage({ src: url }).run();
  }

  if (!editor) {
    return null;
  }

  const boton = (activo = false) =>
    [
      "flex h-9 min-w-9 items-center justify-center rounded-lg px-2",
      "text-sm font-bold transition",
      activo
        ? "bg-slate-950 text-white"
        : "bg-white text-slate-700 hover:bg-slate-100",
    ].join(" ");

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white">
      <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50 p-3">
        <button
          type="button"
          className={boton()}
          onClick={() => editor.chain().focus().undo().run()}
          title="Deshacer"
        >
          <Undo2 size={17} />
        </button>

        <button
          type="button"
          className={boton()}
          onClick={() => editor.chain().focus().redo().run()}
          title="Rehacer"
        >
          <Redo2 size={17} />
        </button>

        <button
          type="button"
          className={boton(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Negrita"
        >
          <Bold size={17} />
        </button>

        <button
          type="button"
          className={boton(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Cursiva"
        >
          <Italic size={17} />
        </button>

        <button
          type="button"
          className={boton(
            editor.isActive("heading", { level: 1 }),
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          title="Título grande"
        >
          <Heading1 size={18} />
        </button>

        <button
          type="button"
          className={boton(
            editor.isActive("heading", { level: 2 }),
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="Subtítulo"
        >
          <Heading2 size={18} />
        </button>

        <button
          type="button"
          className={boton(
            editor.isActive({ textAlign: "left" }),
          )}
          onClick={() =>
            editor.chain().focus().setTextAlign("left").run()
          }
          title="Alinear a la izquierda"
        >
          <AlignLeft size={17} />
        </button>

        <button
          type="button"
          className={boton(
            editor.isActive({ textAlign: "center" }),
          )}
          onClick={() =>
            editor.chain().focus().setTextAlign("center").run()
          }
          title="Centrar"
        >
          <AlignCenter size={17} />
        </button>

        <button
          type="button"
          className={boton(
            editor.isActive({ textAlign: "right" }),
          )}
          onClick={() =>
            editor.chain().focus().setTextAlign("right").run()
          }
          title="Alinear a la derecha"
        >
          <AlignRight size={17} />
        </button>

        <button
          type="button"
          className={boton(editor.isActive("bulletList"))}
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          title="Lista"
        >
          <List size={17} />
        </button>

        <button
          type="button"
          className={boton(editor.isActive("orderedList"))}
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          title="Lista numerada"
        >
          <ListOrdered size={17} />
        </button>

        <button
          type="button"
          className={boton()}
          onClick={insertarImagen}
          title="Insertar imagen"
        >
          <ImagePlus size={17} />
          <span className="ml-2">Imagen</span>
        </button>
      </div>

      <EditorContent editor={editor} />

      <input type="hidden" name={name} value={html} />
    </div>
  );
}