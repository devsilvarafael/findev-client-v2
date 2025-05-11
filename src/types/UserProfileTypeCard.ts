export interface UserProfileTypeCardProps {
  id: string;
  title: string;
  subtitle: string;
  avatars: Avatar[];
  selectedId?: string | null;
  selectedUrl: string | null;
  onSelectCard: () => void;
}

type Avatar = {
  id: string;
  url: string;
};
