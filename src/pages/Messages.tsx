import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Send, Plus, Megaphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: "general" | "exam" | "assignment";
}

const mockAnnouncements: Announcement[] = [
  { id: "1", title: "Midterm Exam Schedule Released", content: "The midterm examination schedule for Semester 2 has been published. Please check your course schedule for exact dates and rooms.", date: "Feb 23, 2026", category: "exam" },
  { id: "2", title: "Assignment 3 Deadline Extended", content: "Due to the national holiday, the deadline for Assignment 3 in CS101 has been extended to March 5, 2026.", date: "Feb 22, 2026", category: "assignment" },
  { id: "3", title: "Campus Wi-Fi Maintenance", content: "Campus Wi-Fi will be down for maintenance on Saturday, March 1 from 6:00 AM to 12:00 PM.", date: "Feb 20, 2026", category: "general" },
];

const catConfig = {
  general: { variant: "secondary" as const, color: "bg-muted/60" },
  exam: { variant: "destructive" as const, color: "bg-destructive/5" },
  assignment: { variant: "default" as const, color: "bg-accent/50" },
};

const Messages = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handlePost = () => {
    if (!title.trim() || !content.trim()) return;
    toast({ title: "Announcement posted", description: `"${title}" has been published.` });
    setTitle("");
    setContent("");
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Messages & Announcements</h1>
        <p className="text-sm text-muted-foreground mt-1">Communicate with your students</p>
      </div>

      <Tabs defaultValue="announcements" className="space-y-4">
        <TabsList className="bg-muted/60">
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="compose">Compose</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="space-y-3">
          {mockAnnouncements.map((a) => (
            <Card key={a.id} className="shadow-card hover:shadow-elevated transition-all duration-200">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${catConfig[a.category].color}`}>
                    <Bell className="h-4 w-4 text-foreground/70" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <h3 className="text-sm font-semibold text-card-foreground">{a.title}</h3>
                      <Badge variant={catConfig[a.category].variant} className="text-[10px] capitalize">{a.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{a.content}</p>
                    <p className="text-xs text-muted-foreground mt-2.5 font-medium">{a.date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="compose">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-accent flex items-center justify-center">
                  <Megaphone className="h-3.5 w-3.5 text-accent-foreground" />
                </div>
                New Announcement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Announcement title" value={title} onChange={(e) => setTitle(e.target.value)} className="h-11" />
              <Textarea placeholder="Write your announcement..." value={content} onChange={(e) => setContent(e.target.value)} rows={5} className="resize-none" />
              <Button onClick={handlePost} className="gap-2 h-11 font-semibold">
                <Send className="h-4 w-4" /> Post Announcement
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Messages;
