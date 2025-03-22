"use client";

import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

const DocumentsPage = () => {

    const { user } = useUser();
    const create = useMutation(api.documents.create);

    const onCreate = () => {
        const promise = create({ title: "Sin título" });

        toast.promise(promise, {
            loading: "Creando una nota nueva...",
            success: "Nota creada con éxito.",
            error: "Fallo al crear la nota."
        });
    };

    return ( 
        <div className="h-full flex flex-col items-center justify-center
        space-y-4">
            <Image 
                src="/empty.png"
                height="300"
                width="300"
                alt="Empty"
            />

            <h2 className="text-lg font-medium">
                Este es el Don Notas de {user?.firstName}, ¡Bienvenida/o!
            </h2>
            <Button onClick={onCreate}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Crea una nota
            </Button>
        </div>
    );
}
 
export default DocumentsPage;