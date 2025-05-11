// /components/hooks/useTabs.ts
import { useState } from "react";

type Tab = {
  name: string;
  id: number;
};

interface UseTabsProps {
  initialTab: Tab;
  tabs: Tab[];
}

export const useTabs = ({ initialTab, tabs }: UseTabsProps) => {
  const [currentTab, setCurrentTab] = useState<Tab>(initialTab);

  const handleChangeTab = (tab: Tab) => {
    setCurrentTab(tab);
  };

  const nextTab = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === currentTab.id);
    const nextIndex = (currentIndex + 1) % tabs.length;
    setCurrentTab(tabs[nextIndex]);
  };

  const prevTab = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === currentTab.id);
    const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    setCurrentTab(tabs[prevIndex]);
  };

  const setTabById = (id: number) => {
    const tab = tabs.find((tab) => tab.id === id);
    if (tab) {
      setCurrentTab(tab);
    }
  };

  return { currentTab, handleChangeTab, nextTab, prevTab, setTabById };
};
