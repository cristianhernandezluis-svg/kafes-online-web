"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import { useRef, useState } from "react";
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
  LoaderCircle,
  Redo2,
  Undo2,
} from "lucide-react";

type ContenidoEditorProps = {
  productoId: number;
  name: string;
  initialContent?: string;
};

type CloudinaryUploadResponse = {
  secure_url?: string;
  public_id?: string;
  error?: {
    message?: string;
  };
};

export default function ContenidoEditor({
  productoId,
  name,
  initialContent = "",
}: ContenidoEditorProps) {
  const inputImagenRef = useRef<HTMLInputElement>(null);

  const [html, setHtml] = useState(initialContent);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [errorImagen, setErrorImagen] = useState("");

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

  async function subirImagen(file: File) {
    if (!editor) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorImagen("Selecciona un archivo de imagen válido.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorImagen("La imagen supera el máximo permitido de 10 MB.");
      return;
    }

    setSubiendoImagen(true);
    setErrorImagen("");

    try {
      const signatureResponse = await fetch(
        "/api/cloudinary/signature",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productoId,
          }),
        },
      );

      if (!signatureResponse.ok) {
        throw new Error("No se pudo preparar la carga.");
      }

      const signatureData =
        (await signatureResponse.json()) as {
          timestamp: number;
          signature: string;
          folder: string;
          apiKey: string;
          cloudName: string;
        };

      const cloudinaryData = new FormData();

      cloudinaryData.append("file", file);
      cloudinaryData.append("api_key", signatureData.apiKey);
      cloudinaryData.append(
        "timestamp",
        String(signatureData.timestamp),
      );
      cloudinaryData.append(
        "signature",
        signatureData.signature,
      );
      cloudinaryData.append("folder", signatureData.folder);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
        {
          method: "POST",
          body: cloudinaryData,
        },
      );

      const uploadResult =
        (await uploadResponse.json()) as CloudinaryUploadResponse;

      if (!uploadResponse.ok || !uploadResult.secure_url) {
        throw new Error(
          uploadResult.error?.message ||
            "No se pudo subir la imagen.",
        );
      }

      editor
        .chain()
        .focus()
        .setImage({
          src: uploadResult.secure_url,
          alt: file.name,
        })
        .insertContent("<p></p>")
        .run();

      setHtml(editor.getHTML());
    } catch (error) {
      setErrorImagen(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al subir la imagen.",
      );
    } finally {
      setSubiendoImagen(false);

      if (inputImagenRef.current) {
        inputImagenRef.current.value = "";
      }
    }
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
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
          title="Negrita"
        >
          <Bold size={17} />
        </button>

        <button
          type="button"
          className={boton(editor.isActive("italic"))}
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
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
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 1 })
              .run()
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
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 2 })
              .run()
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
          disabled={subiendoImagen}
          className={`${boton()} disabled:cursor-not-allowed disabled:opacity-50`}
          onClick={() => inputImagenRef.current?.click()}
          title="Insertar imagen"
        >
          {subiendoImagen ? (
            <LoaderCircle
              size={17}
              className="animate-spin"
            />
          ) : (
            <ImagePlus size={17} />
          )}

          <span className="ml-2">
            {subiendoImagen
              ? "Subiendo..."
              : "Imagen"}
          </span>
        </button>

        <input
          ref={inputImagenRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          disabled={subiendoImagen}
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (file) {
              void subirImagen(file);
            }
          }}
        />
      </div>

      {errorImagen && (
        <div className="border-b border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700">
          {errorImagen}
        </div>
      )}

      <EditorContent editor={editor} />

      <input type="hidden" name={name} value={html} />
    </div>
  );
}