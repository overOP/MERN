import express,{Router} from 'express'
import auth from '../../middleware/auth'
import cartController from '../../controllers/cart/cartController'

const router:Router = express.Router()

router.route("/cart")
.post(auth.isAuthenticated,cartController.addToCart)
.get(auth.isAuthenticated,cartController.getMyCarts)
router.route("/cart/:productId")
.delete(auth.isAuthenticated,cartController.deleteMyCartItem)
.patch(auth.isAuthenticated,cartController.updateCartItem)

export default router 