import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen } from "lucide-react";

interface GradeEntry {
  id: string;
  name: string;
  studentId: string;
  midterm: number | null;
  final: number | null;
  assignment: number | null;
  total: number | null;
  grade: string;
}

const calcGrade = (total: number | null): string => {
  if (total === null) return "—";
  if (total >= 90) return "A";
  if (total >= 80) return "B";
  if (total >= 70) return "C";
  if (total >= 60) return "D";
  return "F";
};

const calcTotal = (m: number | null, f: number | null, a: number | null): number | null => {
  if (m === null || f === null || a === null) return null;
  return Math.round(m * 0.3 + f * 0.4 + a * 0.3);
};

const initialGrades: GradeEntry[] = [
  { id: "1", name: "Chea Dara", studentId: "RUPP-2024-001", midterm: 85, final: 90, assignment: 88, total: null, grade: "" },
  { id: "2", name: "Heng Sokha", studentId: "RUPP-2024-002", midterm: 72, final: 68, assignment: 75, total: null, grade: "" },
  { id: "3", name: "Kim Sreymom", studentId: "RUPP-2024-003", midterm: 95, final: 92, assignment: 97, total: null, grade: "" },
  { id: "4", name: "Ly Veasna", studentId: "RUPP-2024-004", midterm: 60, final: 55, assignment: 65, total: null, grade: "" },
  { id: "5", name: "Mao Chanthy", studentId: "RUPP-2024-005", midterm: null, final: null, assignment: null, total: null, grade: "" },
  { id: "6", name: "Nhem Piseth", studentId: "RUPP-2024-006", midterm: 78, final: 82, assignment: 80, total: null, grade: "" },
].map((g) => {
  const total = calcTotal(g.midterm, g.final, g.assignment);
  return { ...g, total, grade: calcGrade(total) };
});

const gradeColor: Record<string, string> = {
  A: "bg-success text-success-foreground",
  B: "bg-primary text-primary-foreground",
  C: "bg-warning text-warning-foreground",
  D: "bg-muted text-muted-foreground",
  F: "bg-destructive text-destructive-foreground",
  "—": "",
};

const Gradebook = () => {
  const [grades, setGrades] = useState<GradeEntry[]>(initialGrades);
  const [selectedCourse, setSelectedCourse] = useState("cs101");

  const updateScore = (id: string, field: "midterm" | "final" | "assignment", value: string) => {
    const num = value === "" ? null : Math.min(100, Math.max(0, parseInt(value) || 0));
    setGrades((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const updated = { ...g, [field]: num };
        const total = calcTotal(updated.midterm, updated.final, updated.assignment);
        return { ...updated, total, grade: calcGrade(total) };
      })
    );
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Gradebook</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter and manage student grades</p>
        </div>
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
      </div>

      <Card className="shadow-card overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-accent flex items-center justify-center">
              <BookOpen className="h-3.5 w-3.5 text-accent-foreground" />
            </div>
            Grade Sheet
          </CardTitle>
          <p className="text-xs text-muted-foreground ml-9">Midterm 30% · Final 40% · Assignment 30%</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold text-xs uppercase tracking-wide">Student</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wide text-center w-24">Midterm</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wide text-center w-24">Final</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wide text-center w-24">Assignment</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wide text-center w-20">Total</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wide text-center w-20">Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((g) => (
                  <TableRow key={g.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold shrink-0">
                          {g.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{g.name}</p>
                          <p className="text-xs text-muted-foreground">{g.studentId}</p>
                        </div>
                      </div>
                    </TableCell>
                    {(["midterm", "final", "assignment"] as const).map((field) => (
                      <TableCell key={field} className="text-center">
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={g[field] ?? ""}
                          onChange={(e) => updateScore(g.id, field, e.target.value)}
                          className="w-16 mx-auto text-center h-8 text-sm"
                          placeholder="—"
                        />
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-bold text-sm">{g.total ?? "—"}</TableCell>
                    <TableCell className="text-center">
                      {g.grade !== "—" ? (
                        <Badge className={`${gradeColor[g.grade]} text-xs font-bold px-2.5`}>{g.grade}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Gradebook;
