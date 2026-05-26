import { Request, Response, NextFunction } from "express";

import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
  getProductsBySeller,
  updateSellerProduct,
  deleteSellerProduct,
  getSellerProductStats,
  addProductReview,
  canUserReviewProduct,
  getProductReviews,
} from "./product.service";
import { createProductReviewSchema } from "./product.validation";

export async function handleCreateProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const product = await createProduct(req.body);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getProducts(req.query);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetProductById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = String(req.params.id);
    const product = await getProductById(id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = String(req.params.id);
    const product = await updateProduct(id, req.body);

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleDeleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = String(req.params.id);
    const product = await deleteProduct(id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

// ============================================
// SELLER-SPECIFIC PRODUCT HANDLERS
// ============================================

export async function handleCreateSellerProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const product = await createProduct({
      ...req.body,
      sellerId: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetSellerProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await getProductsBySeller(req.user.userId, req.query);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetSellerProductStats(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const stats = await getSellerProductStats(req.user.userId);

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateSellerProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const productId = String(req.params.id);
    const product = await updateSellerProduct(
      productId,
      req.user.userId,
      req.body
    );

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
}

export async function handleDeleteSellerProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const productId = String(req.params.id);
    await deleteSellerProduct(productId, req.user.userId);

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
}

// ============================================
// REVIEW HANDLERS
// ============================================

export async function handleGetProductReviews(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reviews = await getProductReviews(req.params.id);

    return res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetProductReviewState(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.json({
        success: true,
        canReview: false,
      });
    }

    const canReview = await canUserReviewProduct(
      req.params.id,
      req.user.userId
    );

    return res.json({
      success: true,
      canReview,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleAddProductReview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const parsed = createProductReviewSchema.parse({ body: req.body });

    const product = await addProductReview(
      req.params.id,
      req.user.userId,
      parsed.body
    );

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
}