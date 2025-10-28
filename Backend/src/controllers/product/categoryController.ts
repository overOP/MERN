import e from "express"
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
}

const categoryController = new CategoryController()
export default categoryController