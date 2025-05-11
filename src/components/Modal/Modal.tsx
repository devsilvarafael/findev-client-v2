"use client";

import { Dispatch, useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type Field = {
    name: string;
    label: string;
    type: string | "text" | "email" | "number" | "textarea";
};

type ModalProps = {
    open: boolean;
    description: string;
    fields: Field[];
    setModalBehavior: Dispatch<React.SetStateAction<boolean>>
    state: any;
    title: string;
    triggerButton: React.ReactNode;
    onSubmit: (formData: any) => void;
};

export const Modal = ({
    open,
    description,
    setModalBehavior,
    fields,
    state,
    title,
    triggerButton,
    onSubmit,
}: ModalProps) => {
    const [formState, setFormState] = useState(state);

    console.log(formState)

    const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState((prevState: any) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        onSubmit(formState);
    };

    return (
        <Dialog open={open} onOpenChange={setModalBehavior}>
            <DialogTrigger asChild>{triggerButton}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {description}
                </DialogDescription>
                <form className="space-y-4">
                    {fields.map((field) => (
                        <div key={field.name} className="flex flex-col space-y-1">
                            <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                                {field.label}
                            </label>
                            {field.type === "textarea" ? (
                                <textarea
                                    id={field.name}
                                    name={field.name}
                                    value={formState[field.name] || ""}
                                    onChange={handleChangeForm}
                                    className="border rounded-md px-3 py-2 text-sm w-full"
                                />
                            ) : (
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type={field.type}
                                    value={formState[field.name] || ""}
                                    onChange={handleChangeForm}
                                />
                            )}
                        </div>
                    ))}
                </form>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Fechar
                        </Button>
                    </DialogClose>
                    <Button variant="outline" onClick={handleSubmit} className="bg-main text-white" type="submit">
                        Salvar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
