// components/JobForm.tsx
import React, { useState } from "react";
import { ToggleButton } from "./ToggleButton";
import { JobModalities } from "./form/JobModalities";

export const JobForm = () => {
    const [contractType, setContractType] = useState<string | null>(null);
    const [remote, setRemote] = useState(false);
    const [hybrid, setHybrid] = useState(false);
    const [onsite, setOnsite] = useState(false);
    const [locations, setLocations] = useState<string[]>(["Franca, São Paulo"]);
    const [skills, setSkills] = useState<{ name: string; experience: number }[]>([
        { name: "React", experience: 3 },
        { name: "TypeScript", experience: 2 },
        { name: "CSS", experience: 3 },
    ]);

    const handleLocationAdd = () => {
        setLocations([...locations, ""]);
    };

    const handleSkillChange = (index: number, field: string, value: string | number) => {
        const updatedSkills = [...skills];
        updatedSkills[index] = { ...updatedSkills[index], [field]: value };
        setSkills(updatedSkills);
    };

    return (
        <form className="space-y-6 bg-white p-1">
            <JobModalities />
        </form>
    );
};
