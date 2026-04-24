import type { Product } from "@/features/admin/types/product";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/context/use-cart";

export function ProductCard({ product }: { product: Product }) {
const { addItem } = useCart();

  return (
    <div className="group relative border rounded-2xl p-3 bg-background shadow-sm hover:shadow-md transition">
      
      <div className="overflow-hidden rounded-xl bg-muted h-40 flex items-center justify-center">
        <span className="text-xs text-muted-foreground">image</span>
      </div>

      <div className="mt-3 space-y-1 pr-10">
        
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold truncate">
            {product.name}
          </h3>

          <span className="text-sm font-medium bg-muted px-2 py-0.5 rounded-md">
            {product.price.toFixed(2)}€
          </span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 overflow-hidden">
          {product.description}
        </p>
      </div>
        <Button variant="default" size="icon" className={cn( 
          "absolute bottom-3 right-3",
          "h-10 w-10",
          "opacity-0 translate-y-2",
          "group-hover:opacity-100 group-hover:translate-y-0",
          "transition-all duration-200")} onClick={() => addItem({ productId: product.id, quantity: 1 })}>
          <ShoppingCart/>
        </Button>
    </div>
  );
}
