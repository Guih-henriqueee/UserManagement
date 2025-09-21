import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import type { Departamento } from '@/types';

const departamentoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
});

type DepartamentoFormData = z.infer<typeof departamentoSchema>;

interface DepartamentoFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departamento?: Departamento | null;
  onSubmit: (data: Partial<Departamento>) => void;
}

export default function DepartamentoFormModal({
  open,
  onOpenChange,
  departamento,
  onSubmit,
}: DepartamentoFormModalProps) {
  const [cargos, setCargos] = useState<string[]>([]);
  const [novoCargo, setNovoCargo] = useState('');

  const form = useForm<DepartamentoFormData>({
    resolver: zodResolver(departamentoSchema),
    defaultValues: {
      nome: '',
      descricao: '',
    },
  });

  useEffect(() => {
    if (departamento) {
      form.reset({
        nome: departamento.nome,
        descricao: departamento.descricao,
      });
      setCargos(departamento.cargos);
    } else {
      form.reset({
        nome: '',
        descricao: '',
      });
      setCargos([]);
    }
    setNovoCargo('');
  }, [departamento, form, open]);

  const adicionarCargo = () => {
    if (novoCargo.trim() && !cargos.includes(novoCargo.trim())) {
      setCargos(prev => [...prev, novoCargo.trim()]);
      setNovoCargo('');
    }
  };

  const removerCargo = (cargoToRemove: string) => {
    setCargos(prev => prev.filter(cargo => cargo !== cargoToRemove));
  };

  const handleSubmit = (data: DepartamentoFormData) => {
    onSubmit({
      ...data,
      cargos,
    });
    form.reset();
    setCargos([]);
    setNovoCargo('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      adicionarCargo();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {departamento ? 'Editar Departamento' : 'Novo Departamento'}
          </DialogTitle>
          <DialogDescription>
            {departamento 
              ? 'Atualize as informações do departamento.'
              : 'Preencha as informações para criar um novo departamento.'
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
                  <FormLabel>Nome do Departamento *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Tecnologia da Informação" {...field} />
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
                      placeholder="Descreva as responsabilidades e atividades do departamento..."
                      className="resize-none"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Cargos do Departamento</FormLabel>
              <div className="space-y-3 mt-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite um cargo..."
                    value={novoCargo}
                    onChange={(e) => setNovoCargo(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button 
                    type="button" 
                    onClick={adicionarCargo}
                    variant="outline"
                    size="sm"
                    disabled={!novoCargo.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {cargos.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cargos adicionados ({cargos.length}):
                    </p>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {cargos.map((cargo) => (
                        <Badge 
                          key={cargo} 
                          variant="secondary" 
                          className="flex items-center gap-1 pr-1"
                        >
                          {cargo}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => removerCargo(cargo)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-brand hover:opacity-90"
              >
                {departamento ? 'Atualizar' : 'Criar'} Departamento
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}