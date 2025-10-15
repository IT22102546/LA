import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  Edit2,
  Trash2,
  X,
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

function DashPublications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [formError, setFormError] = useState("");

  // Form states for Add/Edit
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [credits, setCredits] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");

  const [publications, setPublications] = useState([
    {
      id: "PUB-001",
      name: "Web Development Guide",
      price: "$49.99",
      credits: "100",
      description: "Complete guide to modern web development",
      status: "Active",
    },
    {
      id: "PUB-002",
      name: "Data Science Handbook",
      price: "$79.99",
      credits: "150",
      description: "Comprehensive data science reference",
      status: "Active",
    },
    {
      id: "PUB-003",
      name: "Mobile App Design",
      price: "$39.99",
      credits: "80",
      description: "UI/UX design principles for mobile apps",
      status: "Inactive",
    },
    {
      id: "PUB-004",
      name: "Cloud Architecture",
      price: "$99.99",
      credits: "200",
      description: "Advanced cloud computing patterns",
      status: "Active",
    },
  ]);

  const resetForm = () => {
    setName("");
    setPrice("");
    setCredits("");
    setDescription("");
    setStatus("Active");
    setFormError("");
  };

  const handleAddPublication = () => {
    if (!name.trim() || !price || !credits) {
      setFormError("Please fill all required fields");
      return;
    }

    const newPublication = {
      id: `PUB-${String(publications.length + 1).padStart(3, "0")}`,
      name,
      price,
      credits,
      description,
      status,
    };

    setPublications([...publications, newPublication]);
    resetForm();
    setShowAddModal(false);
  };

  const handleEditPublication = () => {
    if (!name.trim() || !price || !credits) {
      setFormError("Please fill all required fields");
      return;
    }

    setPublications(
      publications.map((publication) =>
        publication.id === selectedPublication.id
          ? {
              ...publication,
              name,
              price,
              credits,
              description,
              status,
            }
          : publication
      )
    );

    resetForm();
    setShowEditModal(false);
    setSelectedPublication(null);
  };

  const handleDeletePublication = () => {
    setPublications(
      publications.filter(
        (publication) => publication.id !== selectedPublication.id
      )
    );
    setShowDeleteModal(false);
    setSelectedPublication(null);
  };

  const openEditModal = (publication) => {
    setSelectedPublication(publication);
    setName(publication.name);
    setPrice(publication.price);
    setCredits(publication.credits);
    setDescription(publication.description);
    setStatus(publication.status);
    setFormError("");
    setShowEditModal(true);
  };

  const openDeleteModal = (publication) => {
    setSelectedPublication(publication);
    setShowDeleteModal(true);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const filteredPublications = publications.filter((publication) => {
    const matchesSearch =
      publication.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      publication.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      publication.price.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      publication.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <button className="hover:text-foreground">Content</button>
          <span>/</span>
          <span className="text-foreground">Publications</span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Publications
          </h1>
          <p className="text-muted-foreground">
            Manage your publications and digital content
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search publications..."
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
            Add Publication
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-semibold text-sm">Name</th>
                <th className="text-left p-4 font-semibold text-sm">Price</th>
                <th className="text-left p-4 font-semibold text-sm">Credits</th>
                <th className="text-left p-4 font-semibold text-sm">Status</th>
                <th className="text-left p-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPublications.map((publication, index) => (
                <tr
                  key={`${publication.id}-${index}`}
                  className="border-b border-border hover:bg-muted/20 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium">{publication.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {publication.id}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium">
                    {publication.price}
                  </td>
                  <td className="p-4 text-sm">{publication.credits} credits</td>
                  <td className="p-4">
                    <Badge
                      variant={
                        publication.status === "Active" ? "success" : "warning"
                      }
                      className={
                        publication.status === "Active"
                          ? "bg-success/10 text-success hover:bg-success/20"
                          : "bg-warning/10 text-warning hover:bg-warning/20"
                      }
                    >
                      {publication.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(publication)}
                        className="p-2 hover:bg-warning/10 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-warning" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(publication)}
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

        {/* Add Publication Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Publication</DialogTitle>
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter publication name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credits">Credits</Label>
                  <Input
                    id="credits"
                    placeholder="Enter credits"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter publication description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Upload Image Section */}
              <div className="space-y-4 border border-border rounded-lg p-4">
                <Label className="text-base font-medium">Upload Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Choose a file or drag & drop it here
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPEG, PNG, PDF formats, up to 5MB
                  </p>
                  <Button variant="outline" className="mt-3">
                    Browse File
                  </Button>
                </div>
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
                onClick={handleAddPublication}
                className="bg-primary hover:bg-primary/90"
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Publication Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Update Publication</DialogTitle>
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price</Label>
                  <Input
                    id="edit-price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-credits">Credits</Label>
                  <Input
                    id="edit-credits"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                  />
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

              {/* Upload Image Section */}
              <div className="space-y-4 border border-border rounded-lg p-4">
                <Label className="text-base font-medium">Upload Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Choose a file or drag & drop it here
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPEG, PNG, PDF formats, up to 5MB
                  </p>
                  <Button variant="outline" className="mt-3">
                    Browse File
                  </Button>
                </div>
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
                onClick={handleEditPublication}
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
                  Do you really want to delete this publication?
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
                  onClick={handleDeletePublication}
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

export default DashPublications;
