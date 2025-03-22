"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const Heading = () => {

    const { isAuthenticated, isLoading } = useConvexAuth();

    return (
        <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
                Ya sea para estudiar, trabajar o planificar tu 
                día, <span className="underline">Don Notas</span> te ayuda a mantener todo bajo control. 
            </h1>

            <h3 className="text-base sm:text-xl md:text-2xl font-medium">
                Don Notas es tu herramienta definitiva para tomar notas de 
                manera rápida y organizada. <br /> Captura ideas, crea listas, 
                guarda recordatorios y estructura tus pensamientos en un solo lugar.
            </h3>

            { isLoading && (
                <div className="w-full flex items-center justify-center">
                    <Spinner size="lg" />
                </div>
            )}

            { isAuthenticated  && !isLoading && (
                <Button asChild>
                    <Link href="/documents">
                        Usa Don Notas ahora
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            )}

            { !isAuthenticated && !isLoading &&(
                <SignInButton mode="modal">
                    <Button>
                        Obtén Don Notas gratis
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </SignInButton>
            )}
        </div>
    )
}