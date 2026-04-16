import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { apiService } from '../services/apiService';
import theme from '../styles/theme';
import { Badge } from '../components/UIComponents';
import { Layout, Flex, Section } from '../components/LayoutComponents';
import { getProductImage } from '../config/imageMapping';
import { formatINR } from '../utils/priceUtils';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';

const ProductsPage = () => {
  const { addToCart, cart, productRefreshTrigger } = useAppContext();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterText, setFilterText] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [addedProduct, setAddedProduct] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.categoryId === parseInt(selectedCategory));
    }

    if (filterText) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(filterText.toLowerCase()) ||
          p.description?.toLowerCase().includes(filterText.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, filterText]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  useEffect(() => {
    if (productRefreshTrigger > 0) {
      fetchProducts();
    }
  }, [productRefreshTrigger]);

  const fetchCategories = async () => {
    try {
      const response = await apiService.getCategories();
      const data = Array.isArray(response.data) ? response.data : response.data?.content || [];
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await apiService.getProducts(0, 100, null, '');

      const productData = Array.isArray(response.data)
        ? response.data
        : response.data?.content || [];

      const uniqueProducts = Array.from(
        new Map(productData.map((item) => [item.id, item])).values()
      );

      const validProducts = uniqueProducts.filter(
        (p) => p && p.id && p.name
      );

      setProducts(validProducts);
    } catch (err) {
      setError('Failed to load products.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedProduct(product.id);
    setTimeout(() => setAddedProduct(null), 2000);
  };

  const getProductImageUrl = (product) => {
    return getProductImage(product);
  };

  const renderProductCard = (product, index) => (
    <AnimatedCard
      key={product.id}
      index={index}
      delay={0.05}
      className="p-4 flex flex-col h-full overflow-hidden"
    >
      {/* Image */}
      <motion.div
        style={{ position: 'relative', height: '200px', background: '#f5f5f5', borderRadius: '8px' }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={getProductImageUrl(product)}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
        />

        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          {product.active ? (
            <Badge variant="success">In Stock</Badge>
          ) : (
            <Badge variant="error">Out of Stock</Badge>
          )}
        </div>
      </motion.div>

      {/* Content */}
      <div
        style={{
          padding: theme.spacing.lg,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flex: 1,
        }}
      >
        <motion.h3
          style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {product.name}
        </motion.h3>

        <motion.p
          style={{
            fontSize: '14px',
            color: '#4B5563',
            lineHeight: '1.6',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            margin: 0,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          {product.description || "No description available"}
        </motion.p>

        <motion.div
          style={{ fontSize: '20px', fontWeight: '700', color: '#2563eb' }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
        >
          {formatINR(product.unitPrice)}
        </motion.div>

        <AnimatedButton
          onClick={() => handleAddToCart(product)}
          disabled={!product.active}
          variant={addedProduct === product.id ? 'success' : 'primary'}
          className="w-full mt-2"
        >
          {addedProduct === product.id ? '✔ Added' : 'Add to Cart'}
        </AnimatedButton>
      </div>
    </AnimatedCard>
  );

  return (
    <Layout title="Products" subtitle="Browse our collection">
      <Section spacing="xl">

        {/* ✅ FIXED FILTER UI */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Flex
            gap="md"
            style={{
              marginBottom: theme.spacing.xl,
              flexWrap: 'wrap',
              alignItems: 'flex-end',
            }}
          >
            {/* Category */}
            <div style={{ flex: 1, minWidth: '220px' }}>
              <label style={{ fontSize: '13px', marginBottom: '6px', display: 'block' }}>
                Category
              </label>
              <motion.select
                whileFocus={{ scale: 1.02 }}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  padding: '0 12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                }}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name || c.categoryName}
                  </option>
                ))}
              </motion.select>
            </div>

            {/* Search */}
            <div style={{ flex: 2, minWidth: '260px' }}>
              <label style={{ fontSize: '13px', marginBottom: '6px', display: 'block' }}>
                Search
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                placeholder="Search products..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  padding: '0 12px',
                }}
              />
            </div>

            {/* Button */}
            <div style={{ minWidth: '120px' }}>
              <AnimatedButton
                onClick={fetchProducts}
                disabled={loading}
                loading={loading}
                variant="primary"
                className="w-full"
              >
                {loading ? 'Loading' : 'Refresh'}
              </AnimatedButton>
            </div>
          </Flex>
        </motion.div>

        {error && (
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ color: 'red' }}
          >
            {error}
          </motion.p>
        )}

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '40px' }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ fontSize: '40px', display: 'inline-block' }}
            >
              ⟳
            </motion.div>
            <p style={{ marginTop: '16px' }}>Loading products...</p>
          </motion.div>
        ) : filteredProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {filteredProducts.map((product, idx) => renderProductCard(product, idx))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: 'center', padding: '60px 20px' }}
          >
            <p style={{ fontSize: '18px', color: '#999' }}>No products found. Try different filters!</p>
          </motion.div>
        )}
      </Section>
    </Layout>
  );
};

export default ProductsPage;