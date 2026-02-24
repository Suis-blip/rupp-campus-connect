import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, MapPin } from "lucide-react";

interface ScheduleItem {
  id: string;
  course: string;
  type: "lecture" | "lab" | "exam";
  time: string;
  room: string;
  day: string;
}

const weekSchedule: ScheduleItem[] = [
  { id: "1", course: "CS101 - Intro to Programming", type: "lecture", time: "08:00 - 09:30", room: "Hall A-201", day: "Monday" },
  { id: "2", course: "IT202 - Database Systems", type: "lab", time: "10:00 - 12:00", room: "Lab B-105", day: "Monday" },
  { id: "3", course: "CS301 - Algorithms", type: "lecture", time: "14:00 - 15:30", room: "Hall A-301", day: "Tuesday" },
  { id: "4", course: "CS101 - Intro to Programming", type: "lecture", time: "08:00 - 09:30", room: "Hall A-201", day: "Wednesday" },
  { id: "5", course: "IT202 - Database Systems", type: "lecture", time: "10:00 - 11:30", room: "Hall C-102", day: "Wednesday" },
  { id: "6", course: "CS301 - Algorithms", type: "lab", time: "14:00 - 16:00", room: "Lab B-201", day: "Thursday" },
  { id: "7", course: "CS101 - Midterm Exam", type: "exam", time: "09:00 - 11:00", room: "Exam Hall 1", day: "Friday" },
];

const typeConfig = {
  lecture: { label: "Lecture", variant: "default" as const },
  lab: { label: "Lab", variant: "secondary" as const },
  exam: { label: "Exam", variant: "destructive" as const },
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const Schedule = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Schedule</h1>
      <p className="text-sm text-muted-foreground mt-1">Your weekly class schedule</p>
    </div>

    <Tabs defaultValue="week" className="space-y-4">
      <TabsList>
        <TabsTrigger value="week">Week View</TabsTrigger>
        <TabsTrigger value="list">List View</TabsTrigger>
      </TabsList>

      <TabsContent value="week" className="space-y-4">
        {days.map((day) => {
          const items = weekSchedule.filter((s) => s.day === day);
          if (items.length === 0) return null;
          return (
            <Card key={day} className="shadow-card">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-sm font-semibold text-primary">{day}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 rounded-xl bg-secondary/30 p-3.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground">{item.course}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" /> {item.time}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {item.room}
                        </span>
                      </div>
                    </div>
                    <Badge variant={typeConfig[item.type].variant}>{typeConfig[item.type].label}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </TabsContent>

      <TabsContent value="list">
        <Card className="shadow-card">
          <CardContent className="p-4 space-y-2">
            {weekSchedule.map((item) => (
              <div key={item.id} className="flex items-center gap-4 rounded-xl bg-secondary/30 p-3.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground">{item.course}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground font-medium">{item.day}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {item.time}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {item.room}</span>
                  </div>
                </div>
                <Badge variant={typeConfig[item.type].variant}>{typeConfig[item.type].label}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
);

export default Schedule;
