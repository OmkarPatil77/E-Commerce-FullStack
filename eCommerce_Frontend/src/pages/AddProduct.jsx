import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import API from "@/utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    stock: "",
  });

  const categories = ["Electronics", "Fashion", "Books", "Sports", "Beauty-Products"];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("stock", formData.stock);
    data.append("images", imageFile); // IMPORTANT: must match multer field name

    setLoading(true);
    try {
      await API.post("/products/add", data); 
      toast.success("Product added successfully!");
      setFormData({ name: "", price: "", category: "", description: "", stock: "" });
      setImageFile(null);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Product Name</Label>
          <Input name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div>
          <Label>Price</Label>
          <Input type="number" name="price" value={formData.price} onChange={handleChange} required />
        </div>

        <div>
          <Label>Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat, idx) => (
                <SelectItem key={idx} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Product Image</Label>
          <Input type="file" accept="image/*" onChange={handleFileChange} required />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>

        <div>
          <Label>Stock Quantity</Label>
          <Input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : "Add Product"}
        </Button>
      </form>
    </div>
  );
}
