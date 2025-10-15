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
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "../../../lib/utils";

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusStyles = {
    Active: "bg-green-100 text-green-800",
    Inactive: "bg-red-100 text-red-800",
    Draft: "bg-yellow-100 text-yellow-800",
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

// Subject Table Row Component
const SubjectTableRow = ({ subject, onEdit, onDelete, onView }) => {
  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
      <td className="p-4">
        <Checkbox />
      </td>
      <td className="p-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
          {subject.image ? (
            <img
              src={subject.image}
              alt="Subject"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-primary font-semibold">
              {subject.name[0]}
            </span>
          )}
        </div>
      </td>
      <td className="p-4 font-medium text-foreground">{subject.name}</td>
      <td className="p-4 text-foreground">{subject.medium}</td>
      <td className="p-4 text-foreground">{subject.teacher}</td>
      <td className="p-4">
        <StatusBadge status={subject.status} />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(subject)}
            className="h-8 w-8"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(subject)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(subject.id)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

// Subject Table Component
const SubjectTable = ({ subjects, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr className="border-b border-border">
            <th className="p-4 text-left">
              <Checkbox />
            </th>
            <th className="p-4 text-left text-sm font-medium text-muted-foreground">
              Image
            </th>
            <th className="p-4 text-left text-sm font-medium text-muted-foreground">
              Subject
            </th>
            <th className="p-4 text-left text-sm font-medium text-muted-foreground">
              Medium
            </th>
            <th className="p-4 text-left text-sm font-medium text-muted-foreground">
              Teacher
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
          {subjects.map((subject) => (
            <SubjectTableRow
              key={subject.id}
              subject={subject}
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

// Add/Edit Subject Dialog Component
const AddEditSubjectDialog = ({ open, onOpenChange, onSave, editSubject }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    medium: "",
    teacher: "",
    credits: "",
    duration: "",
    status: "Active",
    image: "",
  });

  useEffect(() => {
    if (editSubject) {
      setFormData(editSubject);
    } else {
      setFormData({
        name: "",
        code: "",
        description: "",
        medium: "",
        teacher: "",
        credits: "",
        duration: "",
        status: "Active",
        image: "",
      });
    }
  }, [editSubject, open]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.code ||
      !formData.medium ||
      !formData.teacher
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
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editSubject ? "Edit Subject" : "Add New Subject"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name *</Label>
            <Input
              id="name"
              placeholder="Enter subject name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Subject Code *</Label>
            <Input
              id="code"
              placeholder="Enter subject code"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              placeholder="Enter subject description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medium">Medium *</Label>
            <Select
              value={formData.medium}
              onValueChange={(value) =>
                setFormData({ ...formData, medium: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select medium" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="Sinhala">Sinhala</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Tamil">Tamil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher">Teacher *</Label>
            <Select
              value={formData.teacher}
              onValueChange={(value) =>
                setFormData({ ...formData, teacher: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="Amali Ravi">Amali Ravi</SelectItem>
                <SelectItem value="John Doe">John Doe</SelectItem>
                <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                <SelectItem value="David Wilson">David Wilson</SelectItem>
                <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                type="number"
                placeholder="Credits"
                value={formData.credits}
                onChange={(e) =>
                  setFormData({ ...formData, credits: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="Duration"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Upload Image</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <input
                type="file"
                id="image-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-1">
                  Choose a file or drag & drop it here
                </p>
                <p className="text-xs text-muted-foreground">
                  JPEG, PNG, formats, up to 5MB
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
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
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
            Do you really want to delete this subject?
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

// Main Subjects Management Component
const DashSubjects = () => {
  const [subjects, setSubjects] = useState([
    {
      id: "SUB001",
      name: "Mathematics",
      code: "MATH101",
      description: "Advanced mathematics including calculus and algebra",
      medium: "English",
      teacher: "Amali Ravi",
      credits: "4",
      duration: "120",
      status: "Active",
      image: "",
    },
    {
      id: "SUB002",
      name: "Science",
      code: "SCI201",
      description: "General science covering physics, chemistry and biology",
      medium: "Sinhala",
      teacher: "John Doe",
      credits: "3",
      duration: "90",
      status: "Active",
      image: "",
    },
    {
      id: "SUB003",
      name: "English",
      code: "ENG301",
      description: "English language and literature",
      medium: "English",
      teacher: "Jane Smith",
      credits: "3",
      duration: "90",
      status: "Inactive",
      image: "",
    },
    {
      id: "SUB004",
      name: "History",
      code: "HIS401",
      description: "World history and civilizations",
      medium: "Sinhala",
      teacher: "David Wilson",
      credits: "2",
      duration: "60",
      status: "Draft",
      image: "",
    },
    {
      id: "SUB005",
      name: "Physics",
      code: "PHY501",
      description: "Fundamental principles of physics",
      medium: "English",
      teacher: "Sarah Johnson",
      credits: "4",
      duration: "120",
      status: "Active",
      image: "",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch =
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.teacher.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || subject.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAddSubject = () => {
    setEditingSubject(null);
    setIsAddDialogOpen(true);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setIsAddDialogOpen(true);
  };

  const handleDeleteSubject = (id) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      setSubjects(subjects.filter((s) => s.id !== deletingId));
      toast.success("Subject deleted successfully");
      setDeletingId(null);
    }
  };

  const handleSaveSubject = (subjectData) => {
    if (editingSubject) {
      // Update existing subject
      setSubjects(
        subjects.map((s) =>
          s.id === editingSubject.id ? { ...s, ...subjectData } : s
        )
      );
      toast.success("Subject updated successfully");
    } else {
      // Add new subject
      const newSubject = {
        id: `SUB${Math.floor(100 + Math.random() * 900)}`,
        name: subjectData.name || "",
        code: subjectData.code || "",
        description: subjectData.description || "",
        medium: subjectData.medium || "",
        teacher: subjectData.teacher || "",
        credits: subjectData.credits || "",
        duration: subjectData.duration || "",
        status: subjectData.status || "Active",
        image: subjectData.image || "",
      };
      setSubjects([...subjects, newSubject]);
      toast.success("Subject added successfully");
    }
  };

  const handleViewSubject = (subject) => {
    toast.info(`Viewing details for ${subject.name} - ${subject.code}`);
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
            <span>Academic Management</span>
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Subject Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all subjects in the academic system
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px] max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subjects..."
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
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              Export As
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button onClick={handleAddSubject} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          </div>
        </div>

        {/* Table */}
        <SubjectTable
          subjects={filteredSubjects}
          onEdit={handleEditSubject}
          onDelete={handleDeleteSubject}
          onView={handleViewSubject}
        />

        {/* Dialogs */}
        <AddEditSubjectDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSave={handleSaveSubject}
          editSubject={editingSubject}
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

export default DashSubjects;
