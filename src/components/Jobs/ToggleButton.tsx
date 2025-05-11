import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

type ToggleButtonProps = {
    label: string;
    description: string;
    enabled: boolean;
    onChange: (value: boolean) => void;
};

export const ToggleButton: React.FC<ToggleButtonProps> = ({ label, description, enabled, onChange }) => {
    return (
        <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" checked={enabled} onCheckedChange={onChange} />
            <Label htmlFor="airplane-mode">{label}</Label>
        </div>
    );
};
