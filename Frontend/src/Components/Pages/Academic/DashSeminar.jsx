import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  Edit2,
  Trash2,
  X,
  Calendar,
  Clock,
  Upload,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";

function DashSeminar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSeminar, setSelectedSeminar] = useState(null);
  const [formError, setFormError] = useState("");

  // Form states for Add/Edit
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("Online");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");

  const [seminars, setSeminars] = useState([
    {
      id: "SEM-001",
      title: "Web Development Workshop",
      date: "2024-01-15",
      type: "Online",
      fromTime: "01:00 PM",
      toTime: "03:00 PM",
      description: "Learn modern web development techniques",
      status: "Active",
    },
    {
      id: "SEM-002",
      title: "Data Science Fundamentals",
      date: "2024-01-20",
      type: "Offline",
      fromTime: "10:00 AM",
      toTime: "12:00 PM",
      description: "Introduction to data science and machine learning",
      status: "Active",
    },
    {
      id: "SEM-003",
      title: "Mobile App Development",
      date: "2024-01-25",
      type: "Online",
      fromTime: "02:00 PM",
      toTime: "04:00 PM",
      description: "Building cross-platform mobile applications",
      status: "Inactive",
    },
    {
      id: "SEM-004",
      title: "Cloud Computing Basics",
      date: "2024-02-01",
      type: "Offline",
      fromTime: "09:00 AM",
      toTime: "11:00 AM",
      description: "Understanding cloud services and deployment",
      status: "Active",
    },
  ]);

  const resetForm = () => {
    setTitle("");
    setDate("");
    setType("Online");
    setFromTime("");
    setToTime("");
    setDescription("");
    setStatus("Active");
    setFormError("");
  };

  const handleAddSeminar = () => {
    if (!title.trim() || !date || !fromTime || !toTime) {
      setFormError("Please fill all required fields");
      return;
    }

    const newSeminar = {
      id: `SEM-${String(seminars.length + 1).padStart(3, "0")}`,
      title,
      date,
      type,
      fromTime,
      toTime,
      description,
      status,
    };

    setSeminars([...seminars, newSeminar]);
    resetForm();
    setShowAddModal(false);
  };

  const handleEditSeminar = () => {
    if (!title.trim() || !date || !fromTime || !toTime) {
      setFormError("Please fill all required fields");
      return;
    }

    setSeminars(
      seminars.map((seminar) =>
        seminar.id === selectedSeminar.id
          ? {
              ...seminar,
              title,
              date,
              type,
              fromTime,
              toTime,
              description,
              status,
            }
          : seminar
      )
    );

    resetForm();
    setShowEditModal(false);
    setSelectedSeminar(null);
  };

  const handleDeleteSeminar = () => {
    setSeminars(
      seminars.filter((seminar) => seminar.id !== selectedSeminar.id)
    );
    setShowDeleteModal(false);
    setSelectedSeminar(null);
  };

  const openEditModal = (seminar) => {
    setSelectedSeminar(seminar);
    setTitle(seminar.title);
    setDate(seminar.date);
    setType(seminar.type);
    setFromTime(seminar.fromTime);
    setToTime(seminar.toTime);
    setDescription(seminar.description);
    setStatus(seminar.status);
    setFormError("");
    setShowEditModal(true);
  };

  const openDeleteModal = (seminar) => {
    setSelectedSeminar(seminar);
    setShowDeleteModal(true);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const filteredSeminars = seminars.filter((seminar) => {
    const matchesSearch =
      seminar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seminar.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seminar.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      seminar.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <button className="hover:text-foreground">Events</button>
          <span>/</span>
          <span className="text-foreground">Seminars</span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Seminars</h1>
          <p className="text-muted-foreground">
            Manage your seminars and workshops
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search seminars..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors">
              <span className="text-sm">Status</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <Button
            onClick={openAddModal}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Seminar
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-semibold text-sm">Title</th>
                <th className="text-left p-4 font-semibold text-sm">Type</th>
                <th className="text-left p-4 font-semibold text-sm">Date</th>
                <th className="text-left p-4 font-semibold text-sm">Time</th>
                <th className="text-left p-4 font-semibold text-sm">Status</th>
                <th className="text-left p-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSeminars.map((seminar, index) => (
                <tr
                  key={`${seminar.id}-${index}`}
                  className="border-b border-border hover:bg-muted/20 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium">{seminar.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {seminar.id}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        seminar.type === "Online" ? "default" : "secondary"
                      }
                      className={
                        seminar.type === "Online"
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }
                    >
                      {seminar.type}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm">{seminar.date}</td>
                  <td className="p-4 text-sm">
                    {seminar.fromTime} - {seminar.toTime}
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        seminar.status === "Active" ? "success" : "warning"
                      }
                      className={
                        seminar.status === "Active"
                          ? "bg-success/10 text-success hover:bg-success/20"
                          : "bg-warning/10 text-warning hover:bg-warning/20"
                      }
                    >
                      {seminar.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(seminar)}
                        className="p-2 hover:bg-warning/10 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-warning" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(seminar)}
                        className="p-2 hover:bg-destructive/10 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Seminar Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Seminar</DialogTitle>
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter seminar title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Time</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      type="time"
                      placeholder="From Time"
                      value={fromTime}
                      onChange={(e) => setFromTime(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      type="time"
                      placeholder="To Time"
                      value={toTime}
                      onChange={(e) => setToTime(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter seminar description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {formError && (
                <p className="text-xs text-destructive">{formError}</p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddSeminar}
                className="bg-primary hover:bg-primary/90"
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Seminar Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Update Seminar Info</DialogTitle>
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="edit-date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Type</Label>
                  <select
                    id="edit-type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Time</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      type="time"
                      value={fromTime}
                      onChange={(e) => setFromTime(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      type="time"
                      value={toTime}
                      onChange={(e) => setToTime(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <select
                  id="edit-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {formError && (
                <p className="text-xs text-destructive">{formError}</p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleEditSeminar}
                className="bg-primary hover:bg-primary/90"
              >
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="sm:max-w-md">
            <div className="flex flex-col items-center text-center space-y-4 py-6">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <X className="w-8 h-8 text-destructive" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Are you sure?</h3>
                <p className="text-sm text-muted-foreground">
                  Do you really want to delete this seminar?
                  <br />
                  This process cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 w-full pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteSeminar}
                  className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default DashSeminar;
