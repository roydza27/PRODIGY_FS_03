import { Product } from "./product.model";

export async function createProduct(payload: any) {
  return Product.create(payload);
}

export async function getProducts(query: any) {
  const {
    search,
    category,
    featured,
    status,
    sort = "-createdAt",
    page = "1",
    limit = "10",
  } = query;

  const filter: Record<string, any> = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category) filter.category = category;
  if (status) filter.status = status;
  if (featured === "true") filter.isFeatured = true;
  if (featured === "false") filter.isFeatured = false;

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.max(Number(limit) || 10, 1);
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limitNum),
    Product.countDocuments(filter),
  ]);

  return {
    items,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  };
}

export async function getProductById(id: string) {
  return Product.findById(id);
}

export async function updateProduct(id: string, payload: any) {
  return Product.findByIdAndUpdate(id, payload, { new: true });
}

export async function deleteProduct(id: string) {
  return Product.findByIdAndDelete(id);
}