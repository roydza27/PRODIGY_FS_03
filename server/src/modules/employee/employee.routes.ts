import { Router } from "express"
import {
  createEmployeeController,
  deleteEmployeeController,
  getAllEmployeesController,
  getEmployeeByIdController,
  updateEmployeeController,
} from "./employee.controller"

import { createEmployeeSchema, updateEmployeeSchema } from "./employee.validation"
import { protect, authorizeRoles } from "@/middlewares/auth.middleware"
import { validateBody } from "@/middlewares/validateBody.middleware"

const router = Router()

router.use(protect)

// read access for both admin and user
router.get("/", authorizeRoles("admin", "user"), getAllEmployeesController)
router.get("/:id", authorizeRoles("admin", "user"), getEmployeeByIdController)

// write access for admin only
router.post(
  "/",
  authorizeRoles("admin"),
  validateBody(createEmployeeSchema),
  createEmployeeController
)

router.patch(
  "/:id",
  authorizeRoles("admin"),
  validateBody(updateEmployeeSchema),
  updateEmployeeController
)

router.delete("/:id", authorizeRoles("admin"), deleteEmployeeController)

export default router