import { useAuth } from "@/contexts/AuthContext";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardCheck, BookOpen, CalendarDays, Clock, TrendingUp, ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

// Teacher data
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

// Student data
const studentGrades = [
  { course: "CS101 - Intro to Programming", grade: "B+", score: 84 },
  { course: "IT202 - Database Systems", grade: "A", score: 92 },
  { course: "CS301 - Algorithms", grade: "—", score: null },
];

const gradeColor: Record<string, string> = {
  A: "bg-success text-success-foreground",
  "A-": "bg-success text-success-foreground",
  "B+": "bg-primary text-primary-foreground",
  B: "bg-primary text-primary-foreground",
  "—": "bg-muted text-muted-foreground",
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isStudent = user?.role === "student";

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isStudent ? "Here's your academic overview" : "Here's what's happening today"}
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 self-start sm:self-auto" onClick={() => navigate("/schedule")}>
          <CalendarDays className="h-4 w-4" />
          View Schedule
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>

      {/* Stats */}
      {isStudent ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Enrolled Classes" value={3} subtitle="This semester" icon={<BookOpen className="h-5 w-5" />} />
          <StatCard title="Attendance Rate" value="96.5%" subtitle="Overall" icon={<ClipboardCheck className="h-5 w-5" />} trend={{ value: "1.2%", positive: true }} />
          <StatCard title="Current GPA" value="3.45" subtitle="Cumulative" icon={<GraduationCap className="h-5 w-5" />} trend={{ value: "0.15", positive: true }} />
          <StatCard title="Upcoming Classes" value={2} subtitle="Today" icon={<CalendarDays className="h-5 w-5" />} />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Students" value={156} subtitle="Across 4 courses" icon={<Users className="h-5 w-5" />} trend={{ value: "12 new", positive: true }} />
          <StatCard title="Attendance Rate" value="94.2%" subtitle="This week" icon={<ClipboardCheck className="h-5 w-5" />} trend={{ value: "2.1%", positive: true }} />
          <StatCard title="Pending Grades" value={23} subtitle="Awaiting entry" icon={<BookOpen className="h-5 w-5" />} />
          <StatCard title="Upcoming Classes" value={3} subtitle="Today" icon={<CalendarDays className="h-5 w-5" />} />
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <div className="h-7 w-7 rounded-lg bg-accent flex items-center justify-center">
                <CalendarDays className="h-3.5 w-3.5 text-accent-foreground" />
              </div>
              Today's Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingClasses.map((cls, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl bg-muted/50 p-3.5 hover:bg-muted transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary text-primary-foreground shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">{cls.course}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{cls.time} · {cls.room}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {isStudent ? (
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <div className="h-7 w-7 rounded-lg bg-accent flex items-center justify-center">
                  <GraduationCap className="h-3.5 w-3.5 text-accent-foreground" />
                </div>
                My Grades
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {studentGrades.map((g, i) => (
                <div key={i} className="flex items-center gap-4 rounded-xl bg-muted/50 p-3.5 hover:bg-muted transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary text-primary-foreground shrink-0">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">{g.course}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {g.score !== null ? `Score: ${g.score}/100` : "Not graded yet"}
                    </p>
                  </div>
                  <Badge className={`${gradeColor[g.grade] || "bg-muted text-muted-foreground"} text-xs font-bold px-2.5`}>
                    {g.grade}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <div className="h-7 w-7 rounded-lg bg-accent flex items-center justify-center">
                  <TrendingUp className="h-3.5 w-3.5 text-accent-foreground" />
                </div>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-2.5 px-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                  <div>
                    <p className="text-sm text-card-foreground">{item.action}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
