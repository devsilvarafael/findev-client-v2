import { UserProfileTypeCardProps } from "@/types/UserProfileTypeCard";
import { Card } from "../ui/card";

export const UserProfileTypeCard = ({
  id,
  title,
  subtitle,
  avatars,
  selectedId,
  onSelectCard,
}: UserProfileTypeCardProps) => {
  return (
    <Card
      className={`flex justify-between items-center p-8 rounded-lg border-2 hover:border-primary hover:cursor-pointer max-h-xs ${
        selectedId === id ? "border-primary" : ""
      }`}
      onClick={() => {
        onSelectCard();
      }}
    >
      <div className="flex items-center">
        <div className="flex space-x-2">
          {avatars.map((avatar, index) => (
            <img
              key={index}
              src={avatar.url}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
          ))}
        </div>
        <div className="ml-4">
          <h1 className="text-xl font-medium">{title}</h1>
          <h2 className="text-base font-light tracking-wide">{subtitle}</h2>
        </div>
      </div>

      {selectedId === id && (
        <div className="rounded-full w-5 h-5 bg-primary"></div>
      )}
    </Card>
  );
};
