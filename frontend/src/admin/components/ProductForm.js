import React from 'react';

const ProductForm = ({ 
  formData, 
  handleInputChange, 
  handleSubmit, 
  resetForm, 
  loading, 
  editingProduct,
  categories 
}) => {
  return (
    <div className="glass-panel max-w-2xl rounded-[28px] p-8">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">
        {editingProduct ? 'Edit Product' : 'Add New Product'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="premium-label">Product SKU *</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              placeholder="Enter SKU (e.g., PROD-001)"
              className="premium-input"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="premium-label">Category *</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="premium-input"
              required
              disabled={loading}
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="premium-label">Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            className="premium-input"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="premium-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter product description"
            rows="4"
            className="premium-input"
            disabled={loading}
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="premium-label">Unit Price *</label>
            <input
              type="number"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="premium-input"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="premium-label">Stock Quantity *</label>
            <input
              type="number"
              name="unitsInStock"
              value={formData.unitsInStock}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              className="premium-input"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="premium-label">Status</label>
            <select
              name="active"
              value={formData.active}
              onChange={(e) => handleInputChange({ target: { name: 'active', value: e.target.value === 'true' } })}
              className="premium-input"
              disabled={loading}
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>
        </div>

        <div>
          <label className="premium-label">Image URL</label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
            className="premium-input"
            disabled={loading}
          />
          {formData.imageUrl && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img 
                src={formData.imageUrl} 
                alt="Product preview" 
                className="h-32 object-cover rounded border border-gray-300"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x250?text=Invalid+Image'; }}
              />
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="flex-1 rounded-full border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
