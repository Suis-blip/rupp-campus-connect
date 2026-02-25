import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Copy, Users, BookOpen, Loader2, MapPin, CalendarDays, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Classes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isTeacher = user?.role === "teacher" || user?.role === "admin";

  const { data: myClasses = [], isLoading: loadingClasses } = useQuery({
    queryKey: ["my-classes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: enrollments = [], isLoading: loadingEnrollments } = useQuery({
    queryKey: ["my-enrollments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("*, classes(*)")
        .eq("student_id", user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user && user.role === "student",
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Classes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isTeacher ? "Manage your classes and invite students" : "View your enrolled classes"}
          </p>
        </div>
        {isTeacher && <CreateClassDialog />}
        {user?.role === "student" && <JoinClassDialog />}
      </div>

      {loadingClasses || loadingEnrollments ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : isTeacher ? (
        <TeacherClassList classes={myClasses} />
      ) : (
        <StudentClassList enrollments={enrollments} />
      )}
    </div>
  );
};

function TeacherClassList({ classes }: { classes: any[] }) {
  const { toast } = useToast();

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: "Invite code copied to clipboard." });
  };

  if (classes.length === 0) {
    return (
      <Card className="shadow-card border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-14 w-14 rounded-2xl bg-accent flex items-center justify-center mb-4">
            <BookOpen className="h-6 w-6 text-accent-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No classes yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">Create your first class to get started and share the invite code with students.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {classes.map((cls) => (
        <Card key={cls.id} className="shadow-card hover:shadow-elevated transition-all duration-200 group">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">{cls.name}</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <Hash className="h-3 w-3" />{cls.code}
                </p>
              </div>
              {cls.semester && (
                <Badge variant="secondary" className="text-[10px] font-medium">{cls.semester} {cls.year}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground line-clamp-2">{cls.description || "No description"}</p>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {cls.schedule && (
                <span className="flex items-center gap-1 bg-muted/60 rounded-md px-2 py-1">
                  <CalendarDays className="h-3 w-3" />{cls.schedule}
                </span>
              )}
              {cls.room && (
                <span className="flex items-center gap-1 bg-muted/60 rounded-md px-2 py-1">
                  <MapPin className="h-3 w-3" />{cls.room}
                </span>
              )}
              <span className="flex items-center gap-1 bg-muted/60 rounded-md px-2 py-1">
                <Users className="h-3 w-3" />Cap: {cls.capacity}
              </span>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <code className="flex-1 rounded-md bg-muted/60 px-2.5 py-1.5 text-xs font-mono text-foreground tracking-wider">
                {cls.invite_code}
              </code>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary" onClick={() => copyCode(cls.invite_code)}>
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StudentClassList({ enrollments }: { enrollments: any[] }) {
  if (enrollments.length === 0) {
    return (
      <Card className="shadow-card border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-14 w-14 rounded-2xl bg-accent flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-accent-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Not enrolled in any class</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">Ask your teacher for an invite code and join your first class.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {enrollments.map((e) => (
        <Card key={e.id} className="shadow-card hover:shadow-elevated transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">{e.classes?.name}</CardTitle>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Hash className="h-3 w-3" />{e.classes?.code}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{e.classes?.description || "No description"}</p>
            <div className="flex flex-wrap gap-2 text-xs mt-3">
              {e.classes?.room && (
                <span className="flex items-center gap-1 bg-muted/60 rounded-md px-2 py-1">
                  <MapPin className="h-3 w-3" />{e.classes.room}
                </span>
              )}
              {e.classes?.schedule && (
                <span className="flex items-center gap-1 bg-muted/60 rounded-md px-2 py-1">
                  <CalendarDays className="h-3 w-3" />{e.classes.schedule}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CreateClassDialog() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", description: "", schedule: "", room: "", capacity: "40", semester: "", year: new Date().getFullYear().toString() });

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("classes").insert({
        teacher_id: user!.id,
        name: form.name,
        code: form.code,
        description: form.description,
        schedule: form.schedule,
        room: form.room,
        capacity: parseInt(form.capacity) || 40,
        semester: form.semester,
        year: parseInt(form.year) || new Date().getFullYear(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-classes"] });
      toast({ title: "Class created!", description: `${form.name} has been created.` });
      setOpen(false);
      setForm({ name: "", code: "", description: "", schedule: "", room: "", capacity: "40", semester: "", year: new Date().getFullYear().toString() });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="h-4 w-4" /> New Class</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Class</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Class Name *</Label>
              <Input value={form.name} onChange={set("name")} placeholder="Intro to Programming" required />
            </div>
            <div className="space-y-2">
              <Label>Course Code *</Label>
              <Input value={form.code} onChange={set("code")} placeholder="CS101" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input value={form.description} onChange={set("description")} placeholder="Brief description of the course" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Schedule</Label>
              <Input value={form.schedule} onChange={set("schedule")} placeholder="Mon/Wed 8:00-9:30" />
            </div>
            <div className="space-y-2">
              <Label>Room</Label>
              <Input value={form.room} onChange={set("room")} placeholder="Hall A-201" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Capacity</Label>
              <Input type="number" value={form.capacity} onChange={set("capacity")} />
            </div>
            <div className="space-y-2">
              <Label>Semester</Label>
              <Input value={form.semester} onChange={set("semester")} placeholder="Semester 2" />
            </div>
            <div className="space-y-2">
              <Label>Year</Label>
              <Input type="number" value={form.year} onChange={set("year")} />
            </div>
          </div>
          <Button type="submit" className="w-full h-11 font-semibold" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Class
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function JoinClassDialog() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const { data: cls, error: findErr } = await supabase
        .from("classes")
        .select("id, name")
        .eq("invite_code", code.trim())
        .maybeSingle();
      if (findErr) throw findErr;
      if (!cls) throw new Error("Invalid invite code. Please check and try again.");

      const { error: enrollErr } = await supabase.from("enrollments").insert({
        student_id: user!.id,
        class_id: cls.id,
      });
      if (enrollErr) {
        if (enrollErr.code === "23505") throw new Error("You are already enrolled in this class.");
        throw enrollErr;
      }
      return cls;
    },
    onSuccess: (cls) => {
      queryClient.invalidateQueries({ queryKey: ["my-enrollments"] });
      toast({ title: "Enrolled!", description: `You joined ${cls.name}.` });
      setOpen(false);
      setCode("");
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Join Class</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Join a Class</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-4">
          <div className="space-y-2">
            <Label>Invite Code</Label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter invite code from your teacher" required className="font-mono tracking-wider text-center text-lg h-12" />
          </div>
          <Button type="submit" className="w-full h-11 font-semibold" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Join Class
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default Classes;
