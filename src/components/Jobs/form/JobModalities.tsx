import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch";
import { cloneElement, useState } from "react";
import { RiGlobalLine } from "react-icons/ri";

export const JobModalities = () => {
    const [checked, setChecked] = useState<string | null>(null);

    const modalities = [
        {
            icon: <RiGlobalLine />, label: "Remoto", value: "REMOTE",
            description: "Candidatos podem trabalhar de qualquer lugar."
        },
        {
            icon: <RiGlobalLine />, label: "Híbrido", value: "HYBRID",
            description: "Candidatos trabalham parcialmente remoto e presencial."
        },
        {
            icon: <RiGlobalLine />, label: "Presencial", value: "OFFICE",
            description: "Candidatos precisam ir até o escritório diariamente."
        }
    ]

    return (
        <div className="flex flex-col gap-2">
            {modalities.map(modality => {
                const icon = cloneElement(modality.icon, {
                    className: "w-8 h-8"
                })

                return (
                    <Card>
                        <CardContent className="flex items-center justify-between h-full flex-row p-0 py-0.5 px-6">
                            <div className="flex h-full items-center space-x-2">
                                {icon}

                                <CardHeader className="px-2 max-w-2xl">
                                    {modality.label}

                                    <CardDescription>
                                        {
                                            modality.description ||
                                            <p>Lorem ipsum, dolor sit amet consectetur
                                                adipisicing elit. Enim itaque explicabo dignissimos dolorum tempore unde ad esse modi
                                                corporis. Deserunt optio soluta molestiae voluptatem dolor, quam sapiente corporis qui
                                                aperiam.</p>
                                        }
                                    </CardDescription>
                                </CardHeader>
                            </div>

                            <Switch checked={checked === modality.value} onCheckedChange={() => setChecked(modality.value)} />
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}