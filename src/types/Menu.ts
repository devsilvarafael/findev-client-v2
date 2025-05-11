export interface IMenuProps {
  items: IMenuItem[];
}

type IMenuItem = {
  label: string;
  path: string;
  icon: string;
};
