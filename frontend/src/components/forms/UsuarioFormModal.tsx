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
import { mockDepartamentos, mockUsuarios } from '@/lib/mock-data';
import type { Usuario } from '@/types';
import {SelectField} from '@/components/forms/utils/SelectionComponentStyle';

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
  const defaultValues: UsuarioFormData = {
    nome: '',
    sobrenome: '',
    cpf: '',
    nivelPermissao: 1,
    cargo: '',
    departamento: '',
    gerente: '',
    dataNascimento: '',
    status: 'Ativo',
  };

  const form = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
    defaultValues,
  });

  useEffect(() => {
    if (usuario) form.reset(usuario);
    else form.reset(defaultValues);
  }, [usuario, form, open]);

  const handleSubmit = (data: UsuarioFormData) => {
    onSubmit(data);
    form.reset(defaultValues);
  };

  const potentialManagers = mockUsuarios.filter(
    u =>  u.status === 'Ativo' && u.id !== usuario?.id
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

        <div className="overflow-y-auto max-h-[75vh] pr-3 custom-scrollbar">
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
                      <SelectField
                        value={field.value}
                        onChange={field.onChange}
                        options={mockDepartamentos.map(d => ({
                          id: d.id,
                          label: d.nome,
                          value: d.nome
                        }))}
                        placeholder="Selecione o departamento"
                      />
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
                      <SelectField
                        value={field.value}
                        onChange={field.onChange}
                        options={potentialManagers.map(u => ({
                          id: u.id,
                          label: u.nome,
                          value: u.nome
                        }))}
                        placeholder="Selecione o gerente"
                      />
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
                      <SelectField
                        value={field.value}
                        onChange={field.onChange}
                        options={[
                          { id: 1, label: 'Ativo', value: 'Ativo' },
                          { id: 2, label: 'Inativo', value: 'Inativo' }
                        ]}
                        placeholder="Selecione o status"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Footer */}
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
