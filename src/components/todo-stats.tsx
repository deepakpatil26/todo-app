import { Card, CardContent } from "@/components/ui/card";
import { TodoStats } from "@/types/todo";
import { CheckCircle2, Circle, Clock, ListTodo } from "lucide-react";

interface TodoStatsProps {
  stats: TodoStats;
}

export function TodoStatistics({ stats }: TodoStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="flex items-center p-4">
          <ListTodo className="h-5 w-5 mr-2 text-primary" />
          <div>
            <p className="text-sm font-medium">Total Tasks</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center p-4">
          <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
          <div>
            <p className="text-sm font-medium">Completed</p>
            <p className="text-2xl font-bold">{stats.completed}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center p-4">
          <Circle className="h-5 w-5 mr-2 text-yellow-500" />
          <div>
            <p className="text-sm font-medium">Pending</p>
            <p className="text-2xl font-bold">{stats.pending}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center p-4">
          <Clock className="h-5 w-5 mr-2 text-red-500" />
          <div>
            <p className="text-sm font-medium">Overdue</p>
            <p className="text-2xl font-bold">{stats.overdue}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
