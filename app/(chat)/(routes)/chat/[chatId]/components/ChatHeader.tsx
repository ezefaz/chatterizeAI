'use client';

import { Button } from '@/components/ui/button';
import { Companion, Message } from '@prisma/client';
import { ChevronLeft, Edit, MessagesSquare, MoreVertical, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BotAvatar } from './BotAvatar';
import { useUser } from '@clerk/nextjs';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

interface ChatHeaderProps {
  companion: Companion & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
}

export const ChatHeader = ({ companion }: ChatHeaderProps) => {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();

  const onDelete = async () => {
    try {
      await axios.delete(`/api/personajes/${companion.id}`);

      toast({
        description: 'Eliminado con éxito',
      });

      router.refresh();
      router.push('/');
    } catch (error) {
      toast({
        description: 'Alguno anduvo mal..',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className='w-full flex justify-between items-center border-b border-primary/10 pb-4'>
      <div className='flex gap-x-2 items-center'>
        <Button onClick={() => router.back()} size='icon' variant='ghost'>
          <ChevronLeft className='h-8 w-8' />
        </Button>
        <BotAvatar src={companion.src} />
        <div className='flex flex-col gap-y-1'>
          <div className='flex items-center gap-x-2'>
            <p className='font-bold'>{companion.name}</p>
            <div className='flex items-center text-xs text-muted-foreground'>
              <MessagesSquare className='h-3 w-3 mr-1' />
              {companion._count.messages}
            </div>
          </div>
          <p className='text-xs text-muted-foreground'>Creado por {companion.userName}</p>
        </div>
      </div>
      {user?.id === companion.userId && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='secondary' size='icon'>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => router.push(`/personajes/${companion.id}`)}>
              <Edit className='w-4 h-4 mr-2' />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete}>
              <Trash className='w-4 h-4 mr-2' />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
