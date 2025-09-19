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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockDepartamentos, mockUsuarios } from '@/lib/mock-data';
import type { Usuario } from '@/types';

const usuarioSchema = z.object({
  nome: z.string().min(2),
  sobrenome: z.string().min(2),
  cpf: z.string(),
  nivelPermissao: z.number().min(1).max(10),
  cargo: z.string().min(1),
  departamento: z.string().min(1),
  gerente: z.string().optional(),
  dataNascimento: z.string().min(1),
  status: z.enum(['Ativo', 'Inativo']),
});

type UsuarioFormData = z.infer<typeof usuarioSchema>;

interface UsuarioFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario?: Usuario | null;
  onSubmit: (data: Partial<Usuario>) => void;
}

export default function UsuarioFormModal({
  open,
  onOpenChange,
  usuario,
  onSubmit,
}: UsuarioFormModalProps) {
  const form = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: {
      nome: '',
      sobrenome: '',
      cpf: '',
      nivelPermissao: 1,
      cargo: '',
      departamento: '',
      gerente: '',
      dataNascimento: '',
      status: 'Ativo',
    },
  });

  useEffect(() => {
    if (usuario) form.reset(usuario);
    else form.reset({});
  }, [usuario, form, open]);

  const handleSubmit = (data: UsuarioFormData) => {
    onSubmit(data);
    form.reset();
  };

  const selectedDepartment = form.watch('departamento');

  const potentialManagers = mockUsuarios.filter(
    u => u.nivelPermissao >= 8 && u.status === 'Ativo' && u.id !== usuario?.id
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{usuario ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
          <DialogDescription>
            {usuario ? 'Atualize as informações do usuário.' : 'Preencha os dados do novo usuário.'}
          </DialogDescription>
        </DialogHeader>

        {/* Scroll interno */}
        <div className="overflow-y-auto  max-h-[75vh] pr-3 custom-scrollbar">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">

              {/* === Informações Pessoais === */}
              <h3 className="text-lg font-semibold mb-2">Informações Pessoais</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="João" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sobrenome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sobrenome *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Silva" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="000.000.000-00" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dataNascimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento *</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* === Departamento e Cargo === */}
              <h3 className="text-lg font-semibold mb-2">Organização</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="departamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departamento *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o departamento" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockDepartamentos.map(d => (
                            <SelectItem key={d.id} value={d.nome}>{d.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cargo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cargo *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Cargo do usuário" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gerente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gerente</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o gerente" />
                        </SelectTrigger>
                        <SelectContent>
                          {potentialManagers.map(u => (
                            <SelectItem key={u.id} value={u.nome}>{u.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* === Permissões e Status === */}
              <h3 className="text-lg font-semibold mb-2">Permissões</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="nivelPermissao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nível de Permissão *</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min={1} max={10} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ativo">Ativo</SelectItem>
                          <SelectItem value="Inativo">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-gradient-brand hover:opacity-90">
                  {usuario ? 'Atualizar' : 'Criar'} Usuário
                </Button>
              </DialogFooter>
            </form>
          </Form>
        
        </div>
      </DialogContent>

    </Dialog>
  );
}
