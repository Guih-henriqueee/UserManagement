import { useState, useEffect } from 'react';
import {
  Users,
  Building,
  Monitor,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// Mock data
const statsData = {
  totalUsers: 248,
  totalDepartments: 12,
  activeServices: 45,
  activeContracts: 23,
  expiredContracts: 3,
};

const monthlyData = [
  { month: 'Jan', users: 180, contracts: 15 },
  { month: 'Fev', users: 200, contracts: 18 },
  { month: 'Mar', users: 220, contracts: 20 },
  { month: 'Abr', users: 235, contracts: 22 },
  { month: 'Mai', users: 248, contracts: 23 },
];

const departmentData = [
  { name: 'TI', users: 45, color: '#8B5CF6' },
  { name: 'Vendas', users: 38, color: '#06B6D4' },
  { name: 'Marketing', users: 32, color: '#10B981' },
  { name: 'RH', users: 28, color: '#F59E0B' },
  { name: 'Financeiro', users: 25, color: '#EF4444' },
  { name: 'Outros', users: 80, color: '#6B7280' },
];

const contractStatus = [
  { name: 'Ativos', value: 20, color: '#10B981' },
  { name: 'Expirados', value: 3, color: '#EF4444' },
];

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const StatCard = ({ title, value, icon: Icon, change,  description }: any) => (
    <Card className="relative overflow-hidden group hover:shadow-brand-lg transition-all duration-300 border-0 bg-gradient-subtle dark:bg-gradient-to-br dark:from-card dark:to-muted/20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent className="relative">
        <div className="text-2xl font-bold text-foreground">
          {isLoading ? '---' : value.toLocaleString()}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <TrendingUp className="h-3 w-3 text-green-500" />
          <span className="text-xs text-green-500 font-medium">+{change}%</span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gradient-brand">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Visão geral do sistema de gerenciamento
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Usuários"
          value={statsData.totalUsers}
          icon={Users}
          change={12.5}
          changeType="positive"
          description="este mês"
        />
        <StatCard
          title="Departamentos"
          value={statsData.totalDepartments}
          icon={Building}
          change={8.3}
          changeType="positive"
          description="este mês"
        />
        <StatCard
          title="Serviços Ativos"
          value={statsData.activeServices}
          icon={Monitor}
          change={15.8}
          changeType="positive"
          description="este mês"
        />
        <StatCard
          title="Contratos Ativos"
          value={statsData.activeContracts}
          icon={FileText}
          change={5.2}
          changeType="positive"
          description="este mês"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Growth Chart */}
        <Card className="border-0 bg-gradient-subtle dark:bg-gradient-to-br dark:from-card dark:to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Crescimento Mensal
            </CardTitle>
            <CardDescription>
              Usuários e contratos cadastrados por mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorContracts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background) / 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-md)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="contracts"
                  stroke="hsl(var(--secondary))"
                  fillOpacity={1}
                  fill="url(#colorContracts)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card className="border-0 bg-gradient-subtle dark:bg-gradient-to-br dark:from-card dark:to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Distribuição por Departamento
            </CardTitle>
            <CardDescription>
              Número de usuários por departamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background) / 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-md)',
                  }}
                />
                <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contract Status */}
        <Card className="border-0 bg-gradient-subtle dark:bg-gradient-to-br dark:from-card dark:to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Status dos Contratos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={contractStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {contractStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 bg-gradient-subtle dark:bg-gradient-to-br dark:from-card dark:to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Novo usuário cadastrado</p>
                  <p className="text-xs text-muted-foreground">João Silva - TI</p>
                </div>
                <Badge variant="outline" className="text-xs">Hoje</Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Contrato expirando</p>
                  <p className="text-xs text-muted-foreground">Sistema XYZ</p>
                </div>
                <Badge variant="outline" className="text-xs">2 dias</Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Departamento criado</p>
                  <p className="text-xs text-muted-foreground">Design</p>
                </div>
                <Badge variant="outline" className="text-xs">Ontem</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 bg-gradient-subtle dark:bg-gradient-to-br dark:from-card dark:to-muted/20">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Tarefas importantes do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-destructive/10 to-destructive/20 dark:from-destructive/20 dark:to-destructive/10 border border-destructive/20">
                <div>
                  <p className="text-sm font-medium text-destructive dark:text-destructive-foreground">
                    Contratos Expirados
                  </p>
                  <p className="text-xs text-destructive/80 dark:text-destructive-foreground/80">
                    {statsData.expiredContracts} contratos precisam de atenção
                  </p>
                </div>
                <Badge variant="destructive">{statsData.expiredContracts}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-warning/10 to-warning/20 dark:from-warning/20 dark:to-warning/10 border border-warning/20">
                <div>
                  <p className="text-sm font-medium text-warning dark:text-warning-foreground">
                    Usuários Pendentes
                  </p>
                  <p className="text-xs text-warning/80 dark:text-warning-foreground/80">
                    5 usuários aguardando aprovação
                  </p>
                </div>
                <Badge variant="outline" className="border-warning text-warning">5</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-success/10 to-success/20 dark:from-success/20 dark:to-success/10 border border-success/20">
                <div>
                  <p className="text-sm font-medium text-success dark:text-success-foreground">
                    Sistema Operacional
                  </p>
                  <p className="text-xs text-success/80 dark:text-success-foreground/80">
                    Todos os serviços funcionando
                  </p>
                </div>
                <Badge variant="outline" className="border-success text-success">OK</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}