"use client";

import { useState } from "react";

export const useToggle = (initialState: boolean) => {
    const [toggleValue, setToggleValue] = useState(initialState);

    const toggler = () => setToggleValue((prevState) => !prevState);

    return [toggleValue, toggler] as const;
};
