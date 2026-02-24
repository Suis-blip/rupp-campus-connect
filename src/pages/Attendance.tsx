import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock } from "lucide-react";

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
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
          <Button onClick={markAllPresent} variant="outline" size="sm">Mark All Present</Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {(["present", "absent", "late", "unmarked"] as Status[]).map((s) => (
          <Card key={s} className="shadow-card">
            <CardContent className="p-4 flex items-center justify-between">
              <span className="text-sm font-medium capitalize text-muted-foreground">{s}</span>
              <span className="text-xl font-bold text-card-foreground">{stats[s]}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Student List — {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {students.map((student) => {
              const config = statusConfig[student.status];
              return (
                <div key={student.id} className="flex items-center gap-4 rounded-xl bg-secondary/30 p-3.5 hover:bg-secondary/60 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.studentId}</p>
                  </div>
                  <Badge variant={config.variant} className="hidden sm:flex">{config.label}</Badge>
                  <div className="flex items-center gap-1.5">
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
