import { cloneElement, ReactNode } from "react";
import { MdOutlineDateRange } from "react-icons/md";

interface CardItemInfoProps {
  icon?: ReactNode;
  label: ReactNode;
}

export const CardItemInfo = ({ icon, label }: CardItemInfoProps) => {
  const styledIcon = icon && cloneElement(icon, {
    className: "h-4 text-gray-500"
  })

  return (
    <div className="flex items-center gap-x-1 mt-2">
      {icon && styledIcon}

      <p className="text-sm">{label}</p>
    </div>
  );
};
