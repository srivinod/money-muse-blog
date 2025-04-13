
import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import PageHeader from "@/components/PageHeader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";

// Sample categories data 
const initialCategories = [
  { id: "1", name: "Saving Money", slug: "saving", postCount: 5 },
  { id: "2", name: "Budgeting", slug: "budgeting", postCount: 3 },
  { id: "3", name: "Investing", slug: "investing", postCount: 7 },
  { id: "4", name: "Frugal Living", slug: "frugal-living", postCount: 2 },
  { id: "5", name: "Financial Planning", slug: "financial-planning", postCount: 4 },
];

const CategoriesManagementPage = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editCategory, setEditCategory] = useState<{id: string, name: string, slug: string} | null>(null);

  // Filter categories based on search term
  const filteredCategories = categories.filter(
    (category) => category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter(category => category.id !== id));
      toast({
        title: "Category deleted",
        description: "The category has been deleted successfully",
      });
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() === "") {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const slug = newCategoryName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const newCategory = {
      id: Date.now().toString(),
      name: newCategoryName,
      slug,
      postCount: 0,
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    
    toast({
      title: "Category added",
      description: "The new category has been added successfully",
    });
  };

  const handleEditCategory = () => {
    if (!editCategory) return;
    
    if (editCategory.name.trim() === "") {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const updatedCategories = categories.map(category => 
      category.id === editCategory.id 
        ? { 
            ...category, 
            name: editCategory.name,
            slug: editCategory.slug 
          } 
        : category
    );

    setCategories(updatedCategories);
    setEditCategory(null);
    
    toast({
      title: "Category updated",
      description: "The category has been updated successfully",
    });
  };

  const startEdit = (category: {id: string, name: string, slug: string}) => {
    setEditCategory({...category});
  };

  return (
    <div>
      <PageHeader 
        title="Categories Management" 
        description="Create, edit, and delete categories for blog posts"
      />
      
      <div className="container py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <Link to="/admin/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-8 w-full"
            />
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <label className="text-sm font-medium mb-2 block">
                  Category Name
                </label>
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                />
                <p className="text-sm text-gray-500 mt-1">
                  The slug will be generated automatically from the name.
                </p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAddCategory}>Add Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Posts</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>{category.postCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => startEdit(category)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Category</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <label className="text-sm font-medium mb-2 block">
                                Category Name
                              </label>
                              <Input
                                value={editCategory?.name || ""}
                                onChange={(e) => 
                                  setEditCategory(prev => 
                                    prev ? {...prev, name: e.target.value} : null
                                  )
                                }
                                placeholder="Enter category name"
                              />
                              <label className="text-sm font-medium mb-2 mt-4 block">
                                Slug
                              </label>
                              <Input
                                value={editCategory?.slug || ""}
                                onChange={(e) => 
                                  setEditCategory(prev => 
                                    prev ? {...prev, slug: e.target.value} : null
                                  )
                                }
                                placeholder="Enter slug"
                              />
                              <p className="text-sm text-gray-500 mt-1">
                                Use lowercase letters, numbers, and hyphens.
                              </p>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button onClick={handleEditCategory}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(category.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                    {searchTerm ? "No categories found matching your search." : "No categories available."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CategoriesManagementPage;
