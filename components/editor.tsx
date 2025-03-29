"use client";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useState } from "react";
import { Button } from "@/components/ui/button"; // Asegúrate de importar tu componente Button

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
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const editor = useCreateBlockNote({
    initialContent: initialContent ? safeJsonParse(initialContent) : undefined
  });

  function safeJsonParse(content: string) {
    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : undefined;
    } catch {
      return undefined;
    }
  }

  const handleSave = async () => {
    if (!editor.document) return;
    
    setIsSaving(true);
    try {
      const currentContent = JSON.stringify(editor.document);
      await onChange(currentContent);
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Escuchar cambios para mostrar el estado "no guardado"
  editor.onEditorContentChange(() => {
    setHasChanges(true);
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 justify-start mt-4">
        <Button 
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="ml-13"
            >
            {isSaving ? "Guardando..." : "Guardar documento"}
        </Button>
        <div>
          {hasChanges && (
            <span className="text-sm text-muted-foreground">
              Tienes cambios sin guardar
            </span>
          )}
        </div>
      </div>
      
      <BlockNoteView editor={editor} editable={editable} />
    </div>
  );
}