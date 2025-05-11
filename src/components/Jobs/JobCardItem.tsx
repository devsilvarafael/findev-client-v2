"use client";

import { FC, Fragment, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaMoneyBillWave, FaClock, FaFileContract } from "react-icons/fa";
import { Job } from "@/types/Job";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { TbWorldSearch } from "react-icons/tb";
import { IoLocation } from "react-icons/io5";
import { Button } from "../ui/button";
import JobDetailsDrawer from "./JobDetailsDrawer";
import { MdOutlineDateRange } from "react-icons/md";
import { CardItemInfo } from "@/components/Jobs/CardItemInfo";
import { BsBuildingFill } from "react-icons/bs";
import { FiPhone } from "react-icons/fi";
import { MdPriorityHigh } from "react-icons/md";
import { MdOutlineMail } from "react-icons/md";

interface JobCardItemProps {
  job: Job;
}

const JobCardItem: FC<JobCardItemProps> = ({ job }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);


  const priorityMap = {
    HIGH: {
      label: "Alta",
      color: "bg-blue-100 text-blue-800",
      icon: <MdPriorityHigh className="text-blue-800" />,
    },
    MEDIUM: {
      label: "Média",
      color: "bg-yellow-100 text-yellow-800",
      icon: <MdPriorityHigh className="text-yellow-800" />,
    },
    LOW: {
      label: "Baixa",
      color: "bg-gray-100 text-gray-800",
      icon: <MdPriorityHigh className="text-gray-800" />,
    },
  };
  

  const priority = priorityMap[job.priority as keyof typeof priorityMap] ?? {
    label: "Prioridade desconhecida",
    color: "text-gray-600 bg-gray-100",
    icon: <MdPriorityHigh className="text-gray-600" />,
  };

  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  console.log(job);

  if (!job) return <p>Carregando...</p>;

  return (
    <Fragment>
      <h1 className="text-lg font-bold">{job.title}</h1>

      <div className="flex gap-x-2">
        <CardItemInfo
          icon={<MdOutlineDateRange />}
          label={new Date(job.createdAt).toLocaleDateString("pt-BR")}
        />

        <CardItemInfo icon={<BsBuildingFill />} label={job.company.name} />

        <CardItemInfo icon={<TbWorldSearch />} label={    <a
      href={job.company.website}
      target="_blank"
      rel="noopener noreferrer"
      className="underline hover:text-blue-800"
    >
      {job.company.website}
    </a>} />

        <CardItemInfo icon={<MdOutlineMail />} label={job.company.email} />

        <CardItemInfo
      
          label={
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${priority.color}`}
            >
              {priority.label}
            </span>
          }
        />
      </div>
    </Fragment>
  );
};

export default JobCardItem;
