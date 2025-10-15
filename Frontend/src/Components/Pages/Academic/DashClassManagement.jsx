import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Checkbox } from "../../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  ArrowLeft,
  Search,
  Filter,
  Plus,
  ChevronDown,
  Upload,
  Eye,
  Pencil,
  Trash2,
  XCircle,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "../../../lib/utils";

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusStyles = {
    Upcoming: "bg-blue-100 text-blue-800",
    Scheduled: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
    Completed: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={cn(
        "px-3 py-1 rounded-md text-xs font-medium inline-block",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
};

// Class Table Row Component
const ClassTableRow = ({ classItem, onEdit, onDelete, onView }) => {
  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
      <td className="p-4">
        <Checkbox />
      </td>
      <td className="p-4 font-medium text-foreground">{classItem.id}</td>
      <td className="p-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
          {classItem.icon ? (
            <img
              src={classItem.icon}
              alt="Class icon"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-primary font-semibold">
              {classItem.subject[0]}
            </span>
          )}
        </div>
      </td>
      <td className="p-4 text-foreground">{classItem.subject}</td>
      <td className="p-4 text-foreground">{classItem.grade}</td>
      <td className="p-4 text-foreground">{classItem.teacher}</td>
      <td className="p-4 text-foreground">{classItem.date}</td>
      <td className="p-4 text-foreground">
        {classItem.timeRange.from} – {classItem.timeRange.to}
      </td>
      <td className="p-4">
        <StatusBadge status={classItem.status} />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(classItem)}
            className="h-8 w-8"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(classItem)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(classItem.id)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

// Class Table Component
const ClassTable = ({ classes, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr className="border-b border-border">
            <th className="p-4 text-left">
              <Checkbox />
            </th>
            <th className="p-4 text-left text-sm font-medium text-muted-foreground">
              S.ID
            </th>
            <th className="p-4 text-left text-sm font-medium text-muted-foreground">
              Icon
            </th>
            <th className="p-4 text-left text-sm font-medium text-muted-foreground">
              Subject
            </th>
            <th className="p-4 text-left text-sm font-medium text-muted-foreground">
              Grade
            </th>
            <th className="p-4 text-left text-sm font-medium text-muted-foreground">
              Teacher
            </th>
            <th className="p-4 text-left text-sm font-medium text-muted-foreground">
              Date
            </th>
            <th className="p-4 text-left text-sm font-medium text-muted-foreground">
              Time Range
            </th>
            <th className="p-4 text-left text-sm font-medium text-muted-foreground">
              Status
            </th>
            <th className="p-4 text-left text-sm font-medium text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {classes.map((classItem) => (
            <ClassTableRow
              key={classItem.id}
              classItem={classItem}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Add/Edit Class Dialog Component
const AddEditClassDialog = ({ open, onOpenChange, onSave, editClass }) => {
  const [formData, setFormData] = useState({
    subject: "",
    grade: "",
    teacher: "",
    date: "",
    timeRange: { from: "", to: "" },
    status: "Upcoming",
    icon: "",
  });

  useEffect(() => {
    if (editClass) {
      setFormData(editClass);
    } else {
      setFormData({
        subject: "",
        grade: "",
        teacher: "",
        date: "",
        timeRange: { from: "", to: "" },
        status: "Upcoming",
        icon: "",
      });
    }
  }, [editClass, open]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.subject ||
      !formData.grade ||
      !formData.teacher ||
      !formData.date
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    onSave(formData);
    onOpenChange(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, icon: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editClass ? "Edit Class" : "Add New Class"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select
              value={formData.subject}
              onValueChange={(value) =>
                setFormData({ ...formData, subject: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="History">History</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">Grade</Label>
            <Input
              id="grade"
              placeholder="Title"
              value={formData.grade}
              onChange={(e) =>
                setFormData({ ...formData, grade: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher">Teacher</Label>
            <Select
              value={formData.teacher}
              onValueChange={(value) =>
                setFormData({ ...formData, teacher: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Teacher" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="Amali Ravi">Amali Ravi</SelectItem>
                <SelectItem value="John Doe">John Doe</SelectItem>
                <SelectItem value="Jane Smith">Jane Smith</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromTime">From Time</Label>
              <Input
                id="fromTime"
                type="time"
                value={formData.timeRange?.from}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timeRange: {
                      ...formData.timeRange,
                      from: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="toTime">To Time</Label>
              <Input
                id="toTime"
                type="time"
                value={formData.timeRange?.to}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timeRange: {
                      ...formData.timeRange,
                      to: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Upload Icon</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <input
                type="file"
                id="icon-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
              <label htmlFor="icon-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-1">
                  Choose a file or drag & drop it here
                </p>
                <p className="text-xs text-muted-foreground">
                  JPEG, PNG, PDF, formats, up to 5MB
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  Browse File
                </Button>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Delete Confirmation Dialog Component
const DeleteConfirmDialog = ({ open, onOpenChange, onConfirm }) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[400px]">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <XCircle className="h-10 w-10 text-destructive" />
          </div>
          <AlertDialogTitle className="text-xl">Are you sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Do you really want to delete these records?
            <br />
            This process cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row gap-3 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Main Class Management Component
const DashClassManagement = () => {
  const [classes, setClasses] = useState([
    {
      id: "#12345",
      icon: "",
      subject: "Science",
      grade: "Grade 10",
      teacher: "Amali Ravi",
      date: "13.12.2025",
      timeRange: { from: "10:00 AM", to: "12:00 PM" },
      status: "Upcoming",
    },
    {
      id: "#12346",
      icon: "",
      subject: "Science",
      grade: "Grade 10",
      teacher: "Amali Ravi",
      date: "13.12.2025",
      timeRange: { from: "10:00 AM", to: "12:00 PM" },
      status: "Scheduled",
    },
    {
      id: "#12347",
      icon: "",
      subject: "Science",
      grade: "Grade 10",
      teacher: "Amali Ravi",
      date: "13.12.2025",
      timeRange: { from: "10:00 AM", to: "12:00 PM" },
      status: "Cancelled",
    },
    {
      id: "#12348",
      icon: "",
      subject: "Science",
      grade: "Grade 10",
      teacher: "Amali Ravi",
      date: "13.12.2025",
      timeRange: { from: "10:00 AM", to: "12:00 PM" },
      status: "Completed",
    },
    {
      id: "#12349",
      icon: "",
      subject: "Science",
      grade: "Grade 10",
      teacher: "Amali Ravi",
      date: "13.12.2025",
      timeRange: { from: "10:00 AM", to: "12:00 PM" },
      status: "Upcoming",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const filteredClasses = classes.filter((classItem) => {
    const matchesSearch =
      classItem.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || classItem.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAddClass = () => {
    setEditingClass(null);
    setIsAddDialogOpen(true);
  };

  const handleEditClass = (classItem) => {
    setEditingClass(classItem);
    setIsAddDialogOpen(true);
  };

  const handleDeleteClass = (id) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      setClasses(classes.filter((c) => c.id !== deletingId));
      toast.success("Class deleted successfully");
      setDeletingId(null);
    }
  };

  const handleSaveClass = (classData) => {
    if (editingClass) {
      // Update existing class
      setClasses(
        classes.map((c) =>
          c.id === editingClass.id ? { ...c, ...classData } : c
        )
      );
      toast.success("Class updated successfully");
    } else {
      // Add new class
      const newClass = {
        id: `#${Math.floor(10000 + Math.random() * 90000)}`,
        icon: classData.icon || "",
        subject: classData.subject || "",
        grade: classData.grade || "",
        teacher: classData.teacher || "",
        date: classData.date || "",
        timeRange: classData.timeRange || { from: "", to: "" },
        status: classData.status || "Upcoming",
      };
      setClasses([...classes, newClass]);
      toast.success("Class added successfully");
    }
  };

  const handleViewClass = (classItem) => {
    toast.info(`Viewing details for ${classItem.subject} - ${classItem.id}`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Class link Management</span>
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Class Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage you send and receive Transfer Request
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px] max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Upcoming">Upcoming</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              Export As
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button onClick={handleAddClass} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          </div>
        </div>

        {/* Table */}
        <ClassTable
          classes={filteredClasses}
          onEdit={handleEditClass}
          onDelete={handleDeleteClass}
          onView={handleViewClass}
        />

        {/* Dialogs */}
        <AddEditClassDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSave={handleSaveClass}
          editClass={editingClass}
        />

        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  );
};

export default DashClassManagement;
