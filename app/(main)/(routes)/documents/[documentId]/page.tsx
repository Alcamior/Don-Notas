"use client";
import { use } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";
import { Editor } from "@/components/DynamicEditor";
import { useCallback } from "react";

interface DocumentIdPageProps {
    params: {
        documentId: Id<"documents">;
    };
};

const DocumentIdPage = ({
    params
}: DocumentIdPageProps) => {
    const { documentId } = use(params);

    const document = useQuery(api.documents.getById, {  
        documentId  
    });  

    const update = useMutation(api.documents.update);

    const handleSave = async (content: string) => {
    try {
        await update({
        id: documentId, 
        content
        });
        // Puedes añadir un toast de éxito aquí si quieres
    } catch (error) {
        console.error("Error al guardar:", error);
        // Puedes añadir un toast de error aquí
    }
    };
    
    if (document === undefined) {  
        return (  
            <div>  
                <Cover.Skeleton /> 
                <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
                    <div className="space-y-4 pl-8 pt-4">
                        <Skeleton className="h-14 w-[50%]" />
                        <Skeleton className="h-4 w-[80%]" />
                        <Skeleton className="h-4 w-[40%]" />
                        <Skeleton className="h-4 w-[60%]" />
                    </div>
                </div>
            </div>  
        );
    }

    if (document === null) {
        return <div>No se encontró</div>
    }

    return (
        <div className="pb-40">
            <Cover url={document.coverImage} />
            <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
                <Toolbar initialData={document} /> 
                <Editor 
                    onChange={handleSave}
                    initialContent={document.content}
                />
            </div>
        </div>
    );
}

export default DocumentIdPage;