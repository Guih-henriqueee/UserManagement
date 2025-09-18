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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockSistemas } from '@/lib/mock-data';
import type { Contrato } from '@/types';

const contratoSchema = z.object({
  sistemaId: z.string().min(1, 'Sistema é obrigatório'),
  sistema: z.string().min(1, 'Sistema é obrigatório'),
  tipo: z.enum(['Pago', 'Free']),
  dataInicio: z.string().min(1, 'Data de início é obrigatória'),
  dataFim: z.string().min(1, 'Data de fim é obrigatória'),
  licencas: z.number().min(1, 'Pelo menos 1 licença é necessária'),
  custoPorLicenca: z.number().min(0, 'Custo não pode ser negativo'),
  status: z.enum(['Ativo', 'Expirado', 'Suspenso']),
}).refine((data) => {
  const inicio = new Date(data.dataInicio);
  const fim = new Date(data.dataFim);
  return fim > inicio;
}, {
  message: "Data de fim deve ser posterior à data de início",
  path: ["dataFim"],
});

type ContratoFormData = z.infer<typeof contratoSchema>;

interface ContratoFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contrato?: Contrato | null;
  onSubmit: (data: Partial<Contrato>) => void;
}

export default function ContratoFormModal({
  open,
  onOpenChange,
  contrato,
  onSubmit,
}: ContratoFormModalProps) {
  const form = useForm<ContratoFormData>({
    resolver: zodResolver(contratoSchema),
    defaultValues: {
      sistemaId: '',
      sistema: '',
      tipo: 'Free',
      dataInicio: '',
      dataFim: '',
      licencas: 1,
      custoPorLicenca: 0,
      status: 'Ativo',
    },
  });

  const watchTipo = form.watch('tipo');
  const watchSistemaId = form.watch('sistemaId');

  useEffect(() => {
    if (contrato) {
      form.reset({
        sistemaId: contrato.sistemaId,
        sistema: contrato.sistema,
        tipo: contrato.tipo,
        dataInicio: contrato.dataInicio,
        dataFim: contrato.dataFim,
        licencas: contrato.licencas,
        custoPorLicenca: contrato.custoPorLicenca,
        status: contrato.status,
      });
    } else {
      form.reset({
        sistemaId: '',
        sistema: '',
        tipo: 'Free',
        dataInicio: new Date().toISOString().split('T')[0],
        dataFim: '',
        licencas: 1,
        custoPorLicenca: 0,
        status: 'Ativo',
      });
    }
  }, [contrato, form, open]);

  // Auto-fill sistema name when sistemaId changes
  useEffect(() => {
    const selectedSistema = mockSistemas.find(s => s.id === watchSistemaId);
    if (selectedSistema) {
      form.setValue('sistema', selectedSistema.nome);
    }
  }, [watchSistemaId, form]);

  // Reset custo when tipo changes to Free
  useEffect(() => {
    if (watchTipo === 'Free') {
      form.setValue('custoPorLicenca', 0);
    }
  }, [watchTipo, form]);

  const handleSubmit = (data: ContratoFormData) => {
    onSubmit(data);
    form.reset();
  };

  // Calculate suggested end date (1 year from start)
  const suggestEndDate = (startDate: string) => {
    if (!startDate) return;
    const start = new Date(startDate);
    const end = new Date(start);
    end.setFullYear(start.getFullYear() + 1);
    form.setValue('dataFim', end.toISOString().split('T')[0]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {contrato ? 'Editar Contrato' : 'Novo Contrato'}
          </DialogTitle>
          <DialogDescription>
            {contrato 
              ? 'Atualize as informações do contrato.'
              : 'Preencha as informações para criar um novo contrato de serviço.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sistemaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sistema *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o sistema" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockSistemas.map((sistema) => (
                          <SelectItem key={sistema.id} value={sistema.id}>
                            {sistema.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Contrato *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Free">Gratuito</SelectItem>
                        <SelectItem value="Pago">Pago</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dataInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início *</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          // Auto-suggest end date
                          setTimeout(() => suggestEndDate(e.target.value), 100);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataFim"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Fim *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      Data de expiração do contrato
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="licencas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Licenças *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        max={watchTipo === 'Free' ? '1000' : undefined}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 1)}
                      />
                    </FormControl>
                    <FormDescription>
                      {watchTipo === 'Free' 
                        ? 'Contratos gratuitos têm limite flexível'
                        : 'Quantidade de licenças contratadas'
                      }
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="custoPorLicenca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Custo por Licença {watchTipo === 'Pago' && '*'}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          R$
                        </span>
                        <Input 
                          type="number" 
                          min="0"
                          step="0.01"
                          className="pl-10"
                          disabled={watchTipo === 'Free'}
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      {watchTipo === 'Free' 
                        ? 'Contratos gratuitos não têm custo'
                        : 'Valor mensal por licença em Reais'
                      }
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status do Contrato *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Expirado">Expirado</SelectItem>
                      <SelectItem value="Suspenso">Suspenso</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cost Summary */}
            {watchTipo === 'Pago' && (
              <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-lg border">
                <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
                  Resumo do Contrato
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Licenças:</span>
                    <span>{form.watch('licencas')} unidades</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Custo por licença:</span>
                    <span>R$ {form.watch('custoPorLicenca').toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-1">
                    <span>Total mensal:</span>
                    <span className="text-primary dark:text-primary">
                      R$ {(form.watch('licencas') * form.watch('custoPorLicenca')).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-brand hover:opacity-90"
              >
                {contrato ? 'Atualizar' : 'Criar'} Contrato
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}