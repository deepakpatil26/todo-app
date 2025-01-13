/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ThemeProvider } from "@/providers/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { TodoFilters } from "@/components/todo-filters";
import { TodoStatistics } from "@/components/todo-stats";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatDate, isOverdue } from "@/utils/date";
import { Todo, Priority, TodoStats } from "@/types/todo";
import {
  AlertCircle,
  CalendarIcon,
  GripVertical,
  Pencil,
  Tags,
  Trash2,
  X,
} from "lucide-react";

export default function TodoApp() {
  // Initialize state with empty values first

  // Form and filter states
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [newTodoPriority, setNewTodoPriority] = useState<Priority>("medium");
  const [newTodoDate, setNewTodoDate] = useState<Date>();
  const [newTodoCategory, setNewTodoCategory] = useState("");

  // Initialize with proper type checking
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedTodos = localStorage.getItem("todos");
        // Ensure we return an empty array if parsing fails or data is null
        return savedTodos ? JSON.parse(savedTodos) : [];
      } catch (error) {
        console.error("Error parsing todos from localStorage:", error);
        return [];
      }
    }
    return [];
  });

  const [categories, setCategories] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedCategories = localStorage.getItem("categories");
        return savedCategories
          ? JSON.parse(savedCategories)
          : ["personal", "work", "shopping"];
      } catch (error) {
        console.error("Error parsing categories from localStorage:", error);
        return ["personal", "work", "shopping"];
      }
    }
    return ["personal", "work", "shopping"];
  });

  const [isLoaded, setIsLoaded] = useState(true);
  // Load data from localStorage after component mounts
  useEffect(() => {
    if (isLoaded && Array.isArray(todos)) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos, isLoaded]);

  // Save to localStorage whenever todos or categories change
  useEffect(() => {
    if (isLoaded && Array.isArray(categories)) {
      localStorage.setItem("categories", JSON.stringify(categories));
    }
  }, [categories, isLoaded]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      const newTodoItem: Todo = {
        id: crypto.randomUUID(),
        text: newTodo.trim(),
        completed: false,
        priority: newTodoPriority,
        dueDate: newTodoDate?.toISOString(),
        categories: newTodoCategory ? [newTodoCategory] : [],
        createdAt: new Date().toISOString(),
      };
      setTodos([...todos, newTodoItem]);
      setNewTodo("");
      setNewTodoPriority("medium");
      setNewTodoDate(undefined);
      setNewTodoCategory("");
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id: string) => {
    if (editText.trim()) {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, text: editText.trim() } : todo
        )
      );
      setEditingId(null);
      setEditText("");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const addCategory = (category: string) => {
    if (category && !categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTodos(items);
  };

  // Add type checking for stats calculation
  const stats: TodoStats = {
    total: Array.isArray(todos) ? todos.length : 0,
    completed: Array.isArray(todos)
      ? todos.filter((todo) => todo.completed).length
      : 0,
    pending: Array.isArray(todos)
      ? todos.filter((todo) => !todo.completed).length
      : 0,
    overdue: Array.isArray(todos)
      ? todos.filter((todo) => !todo.completed && isOverdue(todo.dueDate))
          .length
      : 0,
  };

  // Add type checking for filtered todos
  const filteredTodos = Array.isArray(todos)
    ? todos.filter((todo) => {
        const matchesSearch = todo.text
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesPriority =
          priorityFilter === "all" || todo.priority === priorityFilter;
        const matchesCategory =
          categoryFilter === "all" || todo.categories.includes(categoryFilter);
        return matchesSearch && matchesPriority && matchesCategory;
      })
    : [];

  // Loading state
  if (!isLoaded) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-background transition-colors duration-300">
          <div className="container mx-auto p-4 max-w-4xl">
            <Card className="mt-8">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-2xl font-bold">Todo App</CardTitle>
                <ThemeToggle />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-32">
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background transition-colors duration-300">
        <div className="container mx-auto p-4 max-w-4xl">
          <Card className="mt-8">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-2xl font-bold">Todo App</CardTitle>
              <ThemeToggle />
            </CardHeader>
            <CardContent className="space-y-4">
              <TodoStatistics stats={stats} />

              <TodoFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                priorityFilter={priorityFilter}
                setPriorityFilter={setPriorityFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                categories={categories}
              />

              <form onSubmit={addTodo} className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-2">
                  <Input
                    type="text"
                    placeholder="Add a new todo..."
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    className="flex-1"
                  />
                  <Select
                    value={newTodoPriority}
                    onValueChange={(value: Priority) =>
                      setNewTodoPriority(value)
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[140px]">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newTodoDate ? (
                          formatDate(newTodoDate.toISOString())
                        ) : (
                          <span>Pick date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newTodoDate}
                        onSelect={setNewTodoDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Add new category..."
                    value={newTodoCategory}
                    onChange={(e) => setNewTodoCategory(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit">Add Todo</Button>
                </div>
              </form>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="todos">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {filteredTodos.map((todo, index) => (
                        <Draggable
                          key={todo.id}
                          draggableId={todo.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={cn(
                                "flex items-center gap-2 p-2 rounded-lg border bg-card text-card-foreground shadow-sm",
                                isOverdue(todo.dueDate) &&
                                  !todo.completed &&
                                  "border-red-500"
                              )}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab"
                              >
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <Checkbox
                                checked={todo.completed}
                                onCheckedChange={() => toggleTodo(todo.id)}
                              />
                              {editingId === todo.id ? (
                                <div className="flex flex-1 items-center gap-2">
                                  <Input
                                    type="text"
                                    value={editText}
                                    onChange={(e) =>
                                      setEditText(e.target.value)
                                    }
                                    className="flex-1"
                                    autoFocus
                                  />
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => saveEdit(todo.id)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={cancelEdit}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={cn(
                                          todo.completed &&
                                            "line-through text-muted-foreground"
                                        )}
                                      >
                                        {todo.text}
                                      </span>
                                      {isOverdue(todo.dueDate) &&
                                        !todo.completed && (
                                          <AlertCircle className="h-4 w-4 text-red-500" />
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2 items-center text-sm">
                                      {todo.dueDate && (
                                        <span className="text-muted-foreground">
                                          Due: {formatDate(todo.dueDate)}
                                        </span>
                                      )}
                                      <Badge
                                        variant={
                                          todo.priority === "high"
                                            ? "destructive"
                                            : todo.priority === "medium"
                                            ? "default"
                                            : "secondary"
                                        }
                                      >
                                        {todo.priority}
                                      </Badge>
                                      {todo.categories.map((category) => (
                                        <Badge key={category} variant="outline">
                                          {category}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => startEditing(todo)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => deleteTodo(todo.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {filteredTodos.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          No todos found. Try adjusting your filters or add a
                          new todo!
                        </p>
                      )}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  );
}
