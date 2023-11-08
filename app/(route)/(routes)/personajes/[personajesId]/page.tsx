import prismaDb from '@/prisma/prismadb';
import CompanionForm from './components/CompanionForm';
import { auth, redirectToSignIn } from '@clerk/nextjs';

interface CompanionIdPageProps {
  params: {
    personajesId: string;
  };
}

const CompanionIdPage = async ({ params }: CompanionIdPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const companion = await prismaDb.companion.findUnique({
    where: {
      id: params.personajesId,
      userId,
    },
  });

  const categories = await prismaDb.category.findMany();

  return (
    <div>
      <CompanionForm initialData={companion} categories={categories} />
    </div>
  );
};

export default CompanionIdPage;
