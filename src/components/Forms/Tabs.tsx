"use client";

import { useState, useEffect, JSX } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentForm } from "@/contexts/CurrentFormContext";

type Tab = {
  name: string;
  id: number;
};

interface TabsFormProps {
  tabs: Tab[];
  forms: JSX.Element[];
}

export const TabsForm = ({ tabs, forms }: TabsFormProps) => {
  const { currentFormId, updateCurrentForm } = useCurrentForm();
  const [currentTab, setCurrentTab] = useState(tabs[currentFormId]);

  useEffect(() => {
    setCurrentTab(tabs[currentFormId]);
  }, [currentFormId, tabs]);

  const handleChangeTab = (tab: Tab) => {
    setCurrentTab(tab);
    updateCurrentForm(tab.id);
  };

  return (
    <Tabs
      defaultValue={tabs[0].name}
      value={currentTab.name}
      className="shadow-md rounded-lg bg-slate-50"
    >
      <TabsList className="w-full flex justify-between">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.name}
            onClick={() => handleChangeTab(tab)}
            className="px-4 py-2 w-full"
          >
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={currentTab.name} className="w-full">
        {forms[currentTab.id]}
      </TabsContent>
    </Tabs>
  );
};
