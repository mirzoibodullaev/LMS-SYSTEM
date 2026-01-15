import { Users, FileText, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useDashboardStats, useRecentSubmissions } from '@/hooks/queries'

interface StatCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: React.ElementType
  trend?: string
  color: 'indigo' | 'emerald' | 'amber' | 'rose'
}

const colorStyles = {
  indigo: 'bg-indigo-100 text-indigo-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  amber: 'bg-amber-100 text-amber-600',
  rose: 'bg-rose-100 text-rose-600',
}

function StatCard({ title, value, subtitle, icon: Icon, trend, color }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{value}</span>
              {trend && (
                <span className="flex items-center text-xs font-medium text-emerald-600">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {trend}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div className={`rounded-xl p-3 ${colorStyles[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: recentSubmissions, isLoading: submissionsLoading } = useRecentSubmissions(5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Обзор системы управления курсовыми работами</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Всего студентов"
          value={statsLoading ? '...' : stats?.totalStudents ?? 0}
          subtitle="активных студентов"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Всего заданий"
          value={statsLoading ? '...' : stats?.totalAssignments ?? 0}
          subtitle="курсовых работ"
          icon={FileText}
          color="emerald"
        />
        <StatCard
          title="Сдано работ"
          value={statsLoading ? '...' : stats?.totalSubmissions ?? 0}
          subtitle="всего сдач"
          icon={CheckCircle}
          color="amber"
        />
        <StatCard
          title="На проверке"
          value={statsLoading ? '...' : stats?.pendingReviews ?? 0}
          subtitle="ожидают оценки"
          icon={Clock}
          color="rose"
        />
      </div>

      <Card>
        <CardHeader className="border-b bg-muted/30">
          <CardTitle>Последние сдачи</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {submissionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="divide-y">
              {recentSubmissions?.map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                      {submission.student?.firstName[0]}
                      {submission.student?.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium">
                        {submission.student?.firstName} {submission.student?.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{submission.assignment?.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        submission.status === 'graded'
                          ? 'success'
                          : submission.status === 'pending'
                            ? 'warning'
                            : 'secondary'
                      }
                    >
                      {submission.status === 'graded'
                        ? `${submission.score} баллов`
                        : submission.status === 'pending'
                          ? 'На проверке'
                          : 'Возвращено'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(submission.submittedAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
