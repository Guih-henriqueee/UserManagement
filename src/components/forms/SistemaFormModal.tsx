import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Sistema } from '@/types';

const sistemaSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
});

type SistemaFormData = z.infer<typeof sistemaSchema>;

interface SistemaFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sistema?: Sistema | null;
  onSubmit: (data: Partial<Sistema>) => void;
}

export default function SistemaFormModal({
  open,
  onOpenChange,
  sistema,
  onSubmit,
}: SistemaFormModalProps) {
  const form = useForm<SistemaFormData>({
    resolver: zodResolver(sistemaSchema),
    defaultValues: {
      nome: '',
      descricao: '',
    },
  });

  useEffect(() => {
    if (sistema) {
      form.reset({
        nome: sistema.nome,
        descricao: sistema.descricao,
      });
    } else {
      form.reset({
        nome: '',
        descricao: '',
      });
    }
  }, [sistema, form, open]);

  const handleSubmit = (data: SistemaFormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {sistema ? 'Editar Sistema' : 'Novo Sistema'}
          </DialogTitle>
          <DialogDescription>
            {sistema 
              ? 'Atualize as informações do sistema.'
              : 'Preencha as informações para criar um novo sistema.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Sistema *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Sistema CRM" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva as funcionalidades e objetivos do sistema..."
                      className="resize-none"
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-brand hover:opacity-90"
              >
                {sistema ? 'Atualizar' : 'Criar'} Sistema
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}