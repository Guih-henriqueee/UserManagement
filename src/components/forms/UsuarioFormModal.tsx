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
import { mockDepartamentos, mockUsuarios } from '@/lib/mock-data';
import type { Usuario } from '@/types';

// CPF validation function
const isValidCPF = (cpf: string) => {
  cpf = cpf.replace(/[^\d]/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf[i]) * (10 - i);
  }
  let remainder = sum % 11;
  let digit1 = remainder < 2 ? 0 : 11 - remainder;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf[i]) * (11 - i);
  }
  remainder = sum % 11;
  let digit2 = remainder < 2 ? 0 : 11 - remainder;
  
  return parseInt(cpf[9]) === digit1 && parseInt(cpf[10]) === digit2;
};

const usuarioSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  sobrenome: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  cpf: z.string().refine(isValidCPF, 'CPF inválido'),
  nivelPermissao: z.number().min(1).max(10),
  cargo: z.string().min(1, 'Cargo é obrigatório'),
  departamento: z.string().min(1, 'Departamento é obrigatório'),
  gerente: z.string().optional(),
  dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
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
    if (usuario) {
      form.reset({
        nome: usuario.nome,
        sobrenome: usuario.sobrenome,
        cpf: usuario.cpf,
        nivelPermissao: usuario.nivelPermissao,
        cargo: usuario.cargo,
        departamento: usuario.departamento,
        gerente: usuario.gerente,
        dataNascimento: usuario.dataNascimento,
        status: usuario.status,
      });
    } else {
      form.reset({
        nome: '',
        sobrenome: '',
        cpf: '',
        nivelPermissao: 1,
        cargo: '',
        departamento: '',
        gerente: '',
        dataNascimento: '',
        status: 'Ativo',
      });
    }
  }, [usuario, form, open]);

  const handleSubmit = (data: UsuarioFormData) => {
    onSubmit(data);
    form.reset();
  };

  const selectedDepartment = form.watch('departamento');
  const selectedDepartmentData = mockDepartamentos.find(d => d.nome === selectedDepartment);
  
  // Get potential managers (users with higher permission levels)
  const potentialManagers = mockUsuarios.filter(u => 
    u.nivelPermissao >= 8 && u.status === 'Ativo' && u.id !== usuario?.id
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {usuario ? 'Editar Usuário' : 'Novo Usuário'}
          </DialogTitle>
          <DialogDescription>
            {usuario 
              ? 'Atualize as informações do usuário abaixo.'
              : 'Preencha as informações para criar um novo usuário.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input placeholder="João" {...field} />
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
                      <Input placeholder="Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="000.000.000-00" 
                        {...field}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          value = value.replace(/(\d{3})(\d)/, '$1.$2');
                          value = value.replace(/(\d{3})(\d)/, '$1.$2');
                          value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                          field.onChange(value);
                        }}
                      />
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
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="departamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o departamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockDepartamentos.map((dept) => (
                          <SelectItem key={dept.id} value={dept.nome}>
                            {dept.nome}
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
                name="cargo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cargo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedDepartmentData?.cargos.map((cargo) => (
                          <SelectItem key={cargo} value={cargo}>
                            {cargo}
                          </SelectItem>
                        )) || (
                          <SelectItem value="" disabled>
                            Selecione um departamento primeiro
                          </SelectItem>
                        )}
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
                name="nivelPermissao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível de Permissão *</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o nível" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            Nível {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Nível de 1 a 10 (maior número = mais permissões)
                    </FormDescription>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o gerente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Nenhum</SelectItem>
                        {potentialManagers.map((manager) => (
                          <SelectItem key={manager.id} value={`${manager.nome} ${manager.sobrenome}`}>
                            {manager.nome} {manager.sobrenome} - {manager.cargo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <FormLabel>Status *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
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
                {usuario ? 'Atualizar' : 'Criar'} Usuário
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}