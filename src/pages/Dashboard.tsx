import { useAuth } from "@/contexts/AuthContext";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardCheck, BookOpen, CalendarDays, Clock, TrendingUp } from "lucide-react";

const recentActivity = [
  { action: "Marked attendance for CS101", time: "10 minutes ago", type: "attendance" },
  { action: "Updated grades for IT202", time: "1 hour ago", type: "grade" },
  { action: "Posted announcement: Midterm Schedule", time: "3 hours ago", type: "message" },
  { action: "Created exam schedule for CS301", time: "Yesterday", type: "schedule" },
];

const upcomingClasses = [
  { course: "CS101 - Intro to Programming", time: "08:00 - 09:30", room: "Hall A-201" },
  { course: "IT202 - Database Systems", time: "10:00 - 11:30", room: "Lab B-105" },
  { course: "CS301 - Algorithms", time: "14:00 - 15:30", room: "Hall A-301" },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.name?.split(" ")[0]}</h1>
        <p className="text-sm text-muted-foreground mt-1">Here's what's happening today</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={156} subtitle="Across 4 courses" icon={<Users className="h-5 w-5" />} trend={{ value: "12 new", positive: true }} />
        <StatCard title="Attendance Rate" value="94.2%" subtitle="This week" icon={<ClipboardCheck className="h-5 w-5" />} trend={{ value: "2.1%", positive: true }} />
        <StatCard title="Pending Grades" value={23} subtitle="Awaiting entry" icon={<BookOpen className="h-5 w-5" />} />
        <StatCard title="Upcoming Classes" value={3} subtitle="Today" icon={<CalendarDays className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" /> Today's Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingClasses.map((cls, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl bg-secondary/50 p-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">{cls.course}</p>
                  <p className="text-xs text-muted-foreground">{cls.time} · {cls.room}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                <div>
                  <p className="text-sm text-card-foreground">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
