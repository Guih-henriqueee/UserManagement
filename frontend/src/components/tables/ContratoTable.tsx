import { useState } from 'react';
import { MoreHorizontal, Edit, Trash2, Eye, AlertCircle, Calendar, DollarSign, Users } from 'lucide-react';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Contrato } from '@/types';

interface ContratosTableProps {
    
  contratos: Contrato[];
  isLoading: boolean;
  onEdit: (contrato: Contrato) => void;
  onDelete: (id: string) => void;
}

export default function ContratosTable({
  contratos,
  isLoading,
  onEdit,
  onDelete,
}: ContratosTableProps) {
  const [deleteContratoId, setDeleteContratoId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeleteContratoId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteContratoId) {
      onDelete(deleteContratoId);
      setDeleteContratoId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ativo':
        return <Badge variant="default" className="bg-green-500">Ativo</Badge>;
      case 'Expirado':
        return <Badge variant="destructive">Expirado</Badge>;
      case 'Suspenso':
        return <Badge variant="secondary">Suspenso</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'Pago':
        return <Badge variant="outline" className="border-purple-300 text-purple-700">Pago</Badge>;
      case 'Free':
        return <Badge variant="outline" className="border-blue-300 text-blue-700">Gratuito</Badge>;
      default:
        return <Badge variant="outline">{tipo}</Badge>;
    }
  };

  const isExpiringSoon = (dataFim: string) => {
    const endDate = new Date(dataFim);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
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

  if (contratos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <AlertCircle className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Nenhum contrato encontrado
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Não há contratos cadastrados no sistema.
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
            <TableRow>
              <TableHead>Sistema</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Vigência</TableHead>
              <TableHead>Licenças</TableHead>
              <TableHead>Custo</TableHead>
              <TableHead>Total Mensal</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contratos.map((contrato) => {
              const expiringSoon = isExpiringSoon(contrato.dataFim);
              const totalMensal = contrato.licencas * contrato.custoPorLicenca;

              return (
                <TableRow 
                  key={contrato.id} 
                  className={`hover:bg-gray-50/50 dark:hover:bg-gray-800/50 ${
                    expiringSoon ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''
                  }`}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-gradient-brand flex items-center justify-center text-white text-sm font-medium">
                        {contrato.sistema.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {contrato.sistema}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {contrato.sistemaId}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    {getTipoBadge(contrato.tipo)}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(contrato.status)}
                      {expiringSoon && contrato.status === 'Ativo' && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Calendar className="h-4 w-4 text-amber-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Expira em breve</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">
                        {new Date(contrato.dataInicio).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-muted-foreground">
                        até {new Date(contrato.dataFim).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{contrato.licencas}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className={contrato.tipo === 'Free' ? 'text-green-600' : ''}>
                        {contrato.tipo === 'Free' ? 'Gratuito' : formatCurrency(contrato.custoPorLicenca)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="font-semibold">
                      {contrato.tipo === 'Free' ? (
                        <span className="text-success">Gratuito</span>
                      ) : (
                        <span className="text-primary dark:text-primary">
                          {formatCurrency(totalMensal)}
                        </span>
                      )}
                    </div>
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
                        <DropdownMenuItem onClick={() => onEdit(contrato)} className="gap-2">
                          <Edit className="h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(contrato.id)}
                          className="gap-2 text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteContratoId} onOpenChange={() => setDeleteContratoId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir este contrato? Esta ação não pode ser desfeita.
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
    </TooltipProvider>
  );
}