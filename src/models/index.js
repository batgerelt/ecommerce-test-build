import AuthModel from './AuthModel/';
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

/** Redux-ийн state-д үүсэх model бүрийг үүсгэх */
const Auth = new AuthModel({ model: 'auth' });
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

export {
  Auth,
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
};
