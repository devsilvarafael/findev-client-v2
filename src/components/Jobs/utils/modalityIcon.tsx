import { FaHome, FaBuilding, FaArrowsAltH, FaFileContract } from "react-icons/fa";

export const getModalityIcon = (modality: string) => {
    switch (modality) {
        case "REMOTE":
            return <FaHome className="text-green-900" />;
        case "OFFICE":
            return <FaBuilding className="text-blue-500" />;
        case "HYBRID":
            return <FaArrowsAltH className="text-orange-500" />;
        default:
            return <FaFileContract className="text-gray-500" />;
    }
};
