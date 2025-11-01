import { Request, Response } from "express";
import Category from "../../database/models/categoryModel"

class CategoryController {
    categoryData = [
        {
            categoryName: "Electronics"
        },
        {
            categoryName: "Grocries"
        },
        {
            categoryName: "Food/Beverages"
        }
    ]
    async seedCategory(): Promise<void> {
        const datas = await Category.findAll()
        if(datas.length === 0){
            const data = await Category.bulkCreate(this.categoryData)
            console.log("✅ Category created successfully")
        }else {
            console.log("ℹ️ Category already exists, skipping seeding")
        }
    }
    // add category
    async addCategory(req: Request, res: Response): Promise<void> {
        const { categoryName } = req.body;
        if(!categoryName) {
            res.status(400).json({
                message: "Please provide a category name"
            })
            return;
        }

        await Category.create({
            categoryName
        })
        res.status(200).json({
            message: "Category created successfully"
        })
    }
    // get all categories
    async getAllCategories(req: Request, res: Response): Promise<void> {
        const categories = await Category.findAll()
        res.status(200).json({
            message: "Categories found successfully",
            data: categories
        })
    }
    // delete category
    async deleteCategory(req: Request, res: Response): Promise<void> {
        const categoryId = req.params.id;
        const category = await Category.findByPk(categoryId);
        if(!category) {
            res.status(404).json({
                message: "Category not found"
            })
            return;
        }
        await category.destroy()
        res.status(200).json({
            message: "Category deleted successfully"
        })
    }
    //  edit category
    async editCategory(req: Request, res: Response): Promise<void> {
        const categoryId = req.params.id;
        const { categoryName } = req.body;
        await Category.update({ categoryName }, {where: { id: categoryId }
        })
        res.status(200).json({
            message: "Category updated successfully"
        })
    }
}

const categoryController = new CategoryController()
export default categoryController