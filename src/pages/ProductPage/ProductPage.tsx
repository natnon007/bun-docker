import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
}



const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setTimeout(() => {
          setPage(prevPage => prevPage + 1);
        }, 2000); 
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);





  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<{ products: Product[] }>('https://dummyjson.com/products');
      const allProducts = response.data.products;
      const shuffled = allProducts.sort(() => 0.5 - Math.random());
      const newProducts = shuffled.slice((page - 1) * 6, page * 6);
      setProducts(prevProducts => [...prevProducts, ...newProducts]);
      setHasMore(newProducts.length > 0);
      setLoading(false);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า');
      setLoading(false);
    }
  }, [page]);


  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (error) return <div className="text-center text-xl font-bold mt-8 text-red-500">{error}</div>;
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">หน้าสินค้า</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <div 
            key={product.id} 
            ref={index === products.length - 1 ? lastProductElementRef : null}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img src={product.images[0]} alt={product.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
              <p className="text-gray-600 mb-2">ราคา: {product.price.toFixed(2)} บาท</p>
              <p className="text-sm text-gray-500">{product.description}</p>
            </div>
          </div>
        ))}
      </div>
      {loading && <div className="text-center text-xl font-bold mt-8">กำลังโหลด...</div>}
    </div>
  );
};

export default ProductPage;