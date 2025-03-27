"use client";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useState } from "react";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

export function BlockNoteEditor({
  onChange,
  initialContent,
  editable 
}: EditorProps) {
  const [lastSavedContent, setLastSavedContent] = useState("");

  const editor = useCreateBlockNote({
    initialContent: initialContent ? safeJsonParse(initialContent) : undefined
  });

  // Función para parsear de forma segura
  function safeJsonParse(content: string) {
    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : undefined;
    } catch {
      return undefined;
    }
  }

  useEffect(() => {
    const handleChange = () => {
      const currentContent = JSON.stringify(editor.document);
      
      // Solo guardar si el contenido realmente cambió
      if (currentContent !== lastSavedContent) {
        onChange(currentContent);
        setLastSavedContent(currentContent);
      }
    };

    // Usamos un timeout para evitar guardados excesivos
    const timer = setTimeout(handleChange, 1000);
    
    return () => {
      clearTimeout(timer);
      // Guardar al desmontar el componente
      if (editor.document) {
        const finalContent = JSON.stringify(editor.document);
        if (finalContent !== lastSavedContent) {
          onChange(finalContent);
        }
      }
    };
  }, [editor.document, lastSavedContent, onChange]);

  return <BlockNoteView editor={editor} editable={editable} />;
}