import { useParams } from 'react-router-dom';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { Menu } from '@/components/Menu/Menu';
import { JobCandidatesKanban } from '@/components/JobCandidatesKanban';

export default function JobCandidatesKanbanPage() {
  const { jobId } = useParams();

  if (!jobId) {
    return <div className="p-8 text-center text-gray-500">Job ID não encontrado.</div>;
  }

  return (
    <DefaultLayout leftSideBar={<Menu />}>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Candidatos da Vaga</h1>
        <JobCandidatesKanban jobId={jobId} />
      </div>
    </DefaultLayout>
  );
} 