import AuthModel from './AuthModel/';
import CategoryModel from './CategoryModel/';
import StaticModel from "./StaticModel/";
import MenuModel from "./MenuModel/";
import BrandModel from "./BrandModel/";
import BannerModel from "./BannerModel/";
import WidgetModel from "./WidgetModel/";
import ProductModel from "./ProductModel/";
import LocationModel from "./LocationModel/";

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
};
