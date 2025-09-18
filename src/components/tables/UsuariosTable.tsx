import { useState } from 'react';
import { MoreHorizontal, Edit, Trash2, Eye, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import type { Usuario } from '@/types';

interface UsuariosTableProps {
  usuarios: Usuario[];
  isLoading: boolean;
  onEdit: (usuario: Usuario) => void;
  onDelete: (id: string) => void;
}

export default function UsuariosTable({
  usuarios,
  isLoading,
  onEdit,
  onDelete,
}: UsuariosTableProps) {
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeleteUserId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteUserId) {
      onDelete(deleteUserId);
      setDeleteUserId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (usuarios.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <AlertCircle className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Nenhum usuário encontrado
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Não há usuários que correspondem aos filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Nível</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Admissão</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-brand flex items-center justify-center text-white text-sm font-medium">
                      {usuario.nome[0]}{usuario.sobrenome[0]}
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-left">
                        {usuario.nome} {usuario.sobrenome}
                      </div>
                      <div className="text-sm text-muted-foreground text-left">
                        Gerente: {usuario.gerente || 'N/A'}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {usuario.cpf}
                </TableCell>
                <TableCell className='text-left'>{usuario.cargo}</TableCell>
                <TableCell className='text-left'>{usuario.departamento}</TableCell>
                <TableCell>
                  <Badge variant={usuario.nivelPermissao >= 8 ? "default" : "secondary"}>
                    Nível {usuario.nivelPermissao}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={usuario.status === 'Ativo' ? "default" : "destructive"}>
                    {usuario.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(usuario.dataAdmissao).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2">
                        <Eye className="h-4 w-4" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(usuario)} className="gap-2">
                        <Edit className="h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(usuario.id)}
                        className="gap-2 text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}