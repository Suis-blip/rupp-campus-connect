import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, Users } from "lucide-react";

type Status = "present" | "absent" | "late" | "unmarked";

interface Student {
  id: string;
  name: string;
  studentId: string;
  status: Status;
}

const initialStudents: Student[] = [
  { id: "1", name: "Chea Dara", studentId: "RUPP-2024-001", status: "unmarked" },
  { id: "2", name: "Heng Sokha", studentId: "RUPP-2024-002", status: "unmarked" },
  { id: "3", name: "Kim Sreymom", studentId: "RUPP-2024-003", status: "unmarked" },
  { id: "4", name: "Ly Veasna", studentId: "RUPP-2024-004", status: "unmarked" },
  { id: "5", name: "Mao Chanthy", studentId: "RUPP-2024-005", status: "unmarked" },
  { id: "6", name: "Nhem Piseth", studentId: "RUPP-2024-006", status: "unmarked" },
  { id: "7", name: "Ouk Samnang", studentId: "RUPP-2024-007", status: "unmarked" },
  { id: "8", name: "Phan Bopha", studentId: "RUPP-2024-008", status: "unmarked" },
];

const statusConfig: Record<Status, { label: string; variant: "default" | "destructive" | "secondary" | "outline"; icon: typeof Check }> = {
  present: { label: "Present", variant: "default", icon: Check },
  absent: { label: "Absent", variant: "destructive", icon: X },
  late: { label: "Late", variant: "secondary", icon: Clock },
  unmarked: { label: "Unmarked", variant: "outline", icon: Clock },
};

const statColors: Record<Status, string> = {
  present: "bg-success/10 text-success border-success/20",
  absent: "bg-destructive/10 text-destructive border-destructive/20",
  late: "bg-warning/10 text-warning border-warning/20",
  unmarked: "bg-muted text-muted-foreground border-border",
};

const Attendance = () => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [selectedCourse, setSelectedCourse] = useState("cs101");

  const markStatus = (id: string, status: Status) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const markAllPresent = () => setStudents((prev) => prev.map((s) => ({ ...s, status: "present" })));

  const stats = {
    present: students.filter((s) => s.status === "present").length,
    absent: students.filter((s) => s.status === "absent").length,
    late: students.filter((s) => s.status === "late").length,
    unmarked: students.filter((s) => s.status === "unmarked").length,
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Attendance</h1>
          <p className="text-sm text-muted-foreground mt-1">Mark and track student attendance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cs101">CS101 - Intro to Programming</SelectItem>
              <SelectItem value="it202">IT202 - Database Systems</SelectItem>
              <SelectItem value="cs301">CS301 - Algorithms</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={markAllPresent} variant="outline" size="sm" className="gap-1.5">
            <Check className="h-3.5 w-3.5" /> All Present
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {(["present", "absent", "late", "unmarked"] as Status[]).map((s) => (
          <Card key={s} className={`border ${statColors[s]} shadow-none`}>
            <CardContent className="p-4 flex items-center justify-between">
              <span className="text-sm font-medium capitalize">{s}</span>
              <span className="text-2xl font-bold">{stats[s]}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-accent flex items-center justify-center">
                <Users className="h-3.5 w-3.5 text-accent-foreground" />
              </div>
              Student List
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            {students.map((student) => {
              const config = statusConfig[student.status];
              return (
                <div key={student.id} className="flex items-center gap-4 rounded-xl bg-muted/40 p-3.5 hover:bg-muted/70 transition-colors">
                  <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                    {student.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.studentId}</p>
                  </div>
                  <Badge variant={config.variant} className="hidden sm:flex text-xs">{config.label}</Badge>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant={student.status === "present" ? "default" : "outline"} className="h-8 w-8 p-0" onClick={() => markStatus(student.id, "present")} title="Present">
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant={student.status === "late" ? "secondary" : "outline"} className="h-8 w-8 p-0" onClick={() => markStatus(student.id, "late")} title="Late">
                      <Clock className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant={student.status === "absent" ? "destructive" : "outline"} className="h-8 w-8 p-0" onClick={() => markStatus(student.id, "absent")} title="Absent">
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;
