import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Priority } from "@/types/todo";

interface TodoFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priorityFilter: Priority | "all";
  setPriorityFilter: (priority: Priority | "all") => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  categories: string[];
}

export function TodoFilters({
  searchQuery,
  setSearchQuery,
  priorityFilter,
  setPriorityFilter,
  categoryFilter,
  setCategoryFilter,
  categories,
}: TodoFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <Input
        placeholder="Search todos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1"
      />
      <Select value={priorityFilter} onValueChange={setPriorityFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
