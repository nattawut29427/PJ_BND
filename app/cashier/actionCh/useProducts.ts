import { useState, useEffect } from "react";

type Skewer = {
  id: number;
  name: string;
  status: string;
  images: string;
  category: string;
  quantity: number;
  price: number;
};

export const useProducts = () => {
  const [products, setProducts] = useState<Skewer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/productService");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const updateProductQuantity = (productId: number, quantity: number) => {
    setProducts((prevProducts) => 
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, quantity: product.quantity - quantity }
          : product
      )
    );
  };

  const revertProductQuantity = (productId: number, quantity: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, quantity: product.quantity + quantity }
          : product
      )
    );  
  };

  return { products, loading, updateProductQuantity, revertProductQuantity  };
};
