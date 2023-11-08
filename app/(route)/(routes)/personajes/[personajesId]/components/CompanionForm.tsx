'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Category, Companion } from '@prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import ImageUpload from '@/components/ImageUpload';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';

import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

const PREAMBLE = `Eres Lionel Messi, uno de los mejores futbolistas de todos los tiempos. Eres conocido por tus habilidades excepcionales en el campo, particularmente por tu habilidad para regatear y marcar goles. Originario de Rosario, Argentina, tienes una pasión eterna por el fútbol, ​​lo que te ha impulsado a alcanzar numerosos hitos en tu carrera. Actualmente estás recordando con amigos cercanos y familiares tus días de infancia en Rosario, comentando tu primer encuentro con el fútbol y el profundo impacto que tuvo en tu vida. Compartes algunos de tus recuerdos más preciados, como jugar en la calle con porterías improvisadas y la emoción de marcar tu primer gol. Hablas de los desafíos que enfrentaste y de la dedicación inquebrantable que te ha llevado a convertirte en una figura legendaria en el mundo del fútbol. Reflexiona sobre los valores que aprecias, como el trabajo duro, la determinación y la perseverancia, que continúan impulsándote a sobresalir tanto dentro como fuera del campo.`;

const SEED_CHAT = `Humano: Hola Messi, ¿cómo te ha ido el día?
Messi: Bastante agitado, en realidad. Entrenando, pasando tiempo con la familia y reflexionando sobre el viaje hasta ahora. ¿Y tú?

Humano: Un día normal para mí. ¿Puedes compartirnos algunas ideas sobre tu pasión por el fútbol y cómo ha dado forma a tu vida?
Messi: El fútbol ha sido mi todo desde que era niño. Es más que un simple juego; Es un modo de vida. Cada partido, cada gol, ha sido un trampolín en mi carrera y me ha convertido en el jugador que soy hoy.

Humano: Tu dedicación es verdaderamente inspiradora. ¿Cómo afrontas la presión de ser un icono del fútbol?
Messi: No siempre es fácil, pero he aprendido a centrarme en lo que realmente importa: el amor por el juego y la alegría que aporta. Mi pasión por el fútbol siempre ha sido mi guía, ayudándome a superar los altibajos de este viaje.

Humano: Es increíble ver tu resiliencia. ¿Hay algún valor que te haya mantenido firme a lo largo de tu carrera?
Messi: Definitivamente. El trabajo duro, la perseverancia y la humildad son los valores que tengo cerca de mi corazón. No sólo me han formado como jugador sino también como persona, recordándome que debo mantenerme humilde a pesar de los éxitos y seguir esforzándome por alcanzar la excelencia.

Humano: Tu viaje es realmente extraordinario. ¿Hay algún plan o proyecto de futuro que le entusiasme en el mundo del fútbol?
Messi: Ahora mismo me estoy centrando en devolverle al deporte que tanto me ha dado. Me apasiona fomentar el talento joven y brindar oportunidades a la próxima generación de futbolistas, asegurando que el legado del juego continúe prosperando e inspirando.`;

interface CompanionFormProps {
  initialData: Companion | null;
  categories: Category[];
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'El nombre es requerido.',
  }),
  description: z.string().min(10, {
    message: 'La instrucciones son requeridas y deben tener al menos 200 caracteres.',
  }),
  instructions: z.string().min(200, {
    message: 'Instrucciones requiren al menos 200 caracteres.',
  }),
  seed: z.string().min(1, {
    message: 'Seed es requerida y debe tener al menos 200 caracteres.',
  }),
  src: z.string().min(1, { message: 'La imagen es requerida.' }),
  categoryId: z.string().min(1, { message: 'La categoria es requerida.' }),
});

const CompanionForm = ({ initialData, categories }: CompanionFormProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      instructions: '',
      seed: '',
      src: '',
      categoryId: undefined,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (initialData) {
        // Actualizamos la informacion necesaria
        await axios.patch(`/api/personajes/${initialData.id}`, values);
      } else {
        // Creamos el personaje
        await axios.post('/api/personajes', values);
      }

      toast({
        description: 'Realizado con éxito',
      });

      router.refresh();
      router.push('/');
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Algo anduvo mal...',
      });
    }
  };

  return (
    <div className='h-full p-4 space-y-2 max-w-3xl mx-auto'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 pb-10'>
          <div className='space-y-2 w-full'>
            <div>
              <h3 className='text-lg font-medium'>Información General</h3>
              <p className='text-sm text-muted-foreground'>Información general sobre tus personajes</p>
            </div>
            <Separator className='bg-primary/10' />
          </div>
          <FormField
            name='src'
            render={({ field }) => (
              <FormItem className='flex flex-col items-center justify-center space-y-4'>
                <FormControl>
                  <ImageUpload disabled={isLoading} onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              name='name'
              control={form.control}
              render={({ field }) => (
                <FormItem className='col-span-2 md:col-span-1'>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder='Leo Messi' {...field} />
                  </FormControl>
                  <FormDescription>De esta manera tu personaje va a ser nombrado</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='description'
              control={form.control}
              render={({ field }) => (
                <FormItem className='col-span-2 md:col-span-1'>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder='El mejor jugador de todos los tiempos' {...field} />
                  </FormControl>
                  <FormDescription>De esta manera tu personaje va a ser descripto</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='categoryId'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='bg-background'>
                        <SelectValue defaultValue={field.value} placeholder='Seleccione la categoría' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Seleccione la categoria para su personaje</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='space-y-2 w-full'>
            <div>
              <h3 className='text-lg font-medium'>Configuración</h3>
              <p className='text-sm text-muted-foreground'>
                Instrucciones Detalladas para el comportamiento de tu personaje
              </p>
            </div>
            <Separator />
          </div>
          <FormField
            name='instructions'
            control={form.control}
            render={({ field }) => (
              <FormItem className='col-span-2 md:col-span-1'>
                <FormLabel>Instrucciones</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isLoading}
                    placeholder={PREAMBLE}
                    {...field}
                    className='bg-background resize-none'
                    rows={7}
                  />
                </FormControl>
                <FormDescription>
                  Describa en detalle la historia e información relevante sobre tu personaje{' '}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name='seed'
            control={form.control}
            render={({ field }) => (
              <FormItem className='col-span-2 md:col-span-1'>
                <FormLabel>Conversación Ejemplo</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isLoading}
                    placeholder={SEED_CHAT}
                    {...field}
                    className='bg-background resize-none'
                    rows={7}
                  />
                </FormControl>
                <FormDescription>
                  Describa en detalle la historia e información relevante sobre tu personaje{' '}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='w-full flex justify-center'>
            <Button size='lg' disabled={isLoading}>
              {initialData ? 'Edita tu personaje' : 'Crea tu personaje'}
              <Wand2 className='w-4 h-4 ml-2' />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CompanionForm;
