import AuthModel from './AuthModel/';
import LocaleModel from './LocaleModel/';
import CategoryModel from './CategoryModel/';
import StaticModel from "./StaticModel/";
import MenuModel from "./MenuModel/";
import BrandModel from "./BrandModel/";
import BannerModel from "./BannerModel/";
import WidgetModel from "./WidgetModel/";
import ProductModel from "./ProductModel/";
import LocationModel from "./LocationModel/";
import PackageModel from "./PackageModel/";
import RecipeModel from "./RecipeModel/";
import FilterModel from "./FilterModel/";
import CartModel from "./CartModel/";
import SearchModel from "./SearchModel/";
import ProfileModel from "./ProfileModel";
import CheckoutModel from "./CheckoutModel";
import UserModel from "./UserModel";
import AttributeModel from "./AttributeModel";
import DiscountModel from "./DiscountModel";
import NewProductModel from "./NewProductModel";
import DynamicMenuModel from "./DynamicMenuModel";

/** Redux-ийн state-д үүсэх model үбрийг үүсгэх */
const Auth = new AuthModel({ model: 'auth' });
const Locale = new LocaleModel({ model: 'locale' });
const Category = new CategoryModel({ model: 'category' });
const Static = new StaticModel({ model: 'staticcontent' });
const Menu = new MenuModel({ model: 'menu' });
const Brand = new BrandModel({ model: 'brand' });
const Banner = new BannerModel({ model: 'banner' });
const Widget = new WidgetModel({ model: 'widget' });
const Product = new ProductModel({ model: 'product' });
const Location = new LocationModel({ model: 'systemlocation' });
const Package = new PackageModel({ model: 'package' });
const Recipe = new RecipeModel({ model: 'recipe' });
const Filter = new FilterModel({ model: 'filter' });
const Cart = new CartModel({ model: 'cart' });
const Search = new SearchModel({ model: 'search' });
const Profile = new ProfileModel({ model: 'profile' });
const Checkout = new CheckoutModel({ model: 'checkout' });
const User = new UserModel({ model: 'user' });
const Attribute = new AttributeModel({ model: 'attribute' });
const Discount = new DiscountModel({ model: 'discount' });
const New = new NewProductModel({ model: 'new' });
const DynamicMenu = new DynamicMenuModel({ model: 'dynamicmenu ' });

export {
  Auth,
  Locale,
  Category,
  Static,
  Menu,
  Brand,
  Banner,
  Widget,
  Product,
  Location,
  Package,
  Recipe,
  Filter,
  Cart,
  Search,
  Profile,
  Checkout,
  User,
  Attribute,
  Discount,
  New,
  DynamicMenu,
};
