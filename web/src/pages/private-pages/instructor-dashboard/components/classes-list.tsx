import { useNavigate } from '@tanstack/react-router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInstructorClassesQuery, useInstructorStatsQuery } from '@/lib/api/private';


export function ClassesList({ instructorId }: { instructorId: string }) {
  const navigate = useNavigate();
  const { data: classes, isLoading } = useInstructorClassesQuery(instructorId);
  const { data: stats, isLoading: statsLoading } = useInstructorStatsQuery(instructorId);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Stats Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Total Classes</CardTitle>
            <CardDescription>Active classes you're teaching</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {statsLoading ? '...' : stats?.total_classes}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
            <CardDescription>Students enrolled in your classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {statsLoading ? '...' : stats?.total_students}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Capacity</CardTitle>
            <CardDescription>Average class fill rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {statsLoading ? '...' : stats?.average_capacity}
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Your Classes</h2>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : classes?.length ? (
        <div className="grid gap-4">
          {classes.map((cls) => (
            <Card key={cls.id} className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => navigate({ to: `/instructor-dashboard/classes/${cls.id}` })}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{cls.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{cls.level}</Badge>
                      <span>•</span>
                      <span>{cls.current_capacity}/{cls.max_capacity} students</span>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{cls.price} PLN</div>
                    <div className="text-sm text-muted-foreground">per class</div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">You haven't created any classes yet.</p>
            <Button onClick={() => navigate({ to: '/instructor-dashboard/classes/create' })}>
              Create Your First Class
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
}
