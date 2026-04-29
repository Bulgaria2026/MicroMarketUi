import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { productService } from "@/features/products/services/product-service";

interface CreateProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

export function CreateProductDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateProductDialogProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    discount: 0,
    amount: 0,
    enabled: true,
  });

  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCreate() {
    if (!form.name.trim()) return;

    setLoading(true);
    try {
      await productService.create({
        ...form,
        name: form.name.trim(),
      });

      setForm({
        name: "",
        description: "",
        price: 0,
        discount: 0,
        amount: 0,
        enabled: true,
      });

      onOpenChange(false);
      onCreated?.();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Product</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-3">
            <Label>Name</Label>
            <Input
              placeholder="e.g. Sparkling Water"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />

            <Label>Description</Label>
            <Textarea
              placeholder="Write something about the product..."
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => update("price", Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Discount (%)</Label>
              <Input
                type="number"
                value={form.discount}
                onChange={(e) => update("discount", Number(e.target.value))}
              />
            </div>
          </div>

          {/* Inventory */}
          <div className="space-y-2">
            <Label>Stock</Label>
            <Input
              type="number"
              value={form.amount}
              onChange={(e) => update("amount", Number(e.target.value))}
            />
          </div>

          {/* Status */}
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="text-sm font-medium">Enabled</p>
              <p className="text-xs text-muted-foreground">
                Product is visible in the shop
              </p>
            </div>

            <Switch
              checked={form.enabled}
              onCheckedChange={(val: boolean) => update("enabled", val)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              onClick={handleCreate}
              disabled={!form.name.trim() || loading}
            >
              {loading ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
