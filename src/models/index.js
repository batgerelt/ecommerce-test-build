import AuthModel from './AuthModel/';
import CategoryModel from './CategoryModel/';
import StaticModel from "./StaticModel/";
import MenuModel from "./MenuModel/";

const Auth = new AuthModel({
  model: 'auth',
});

const Category = new CategoryModel({
  model: 'category',
});

const Static = new StaticModel({
  model: 'staticcontent',
});

const Menu = new MenuModel({
  model: 'menu',
});

export {
  Auth,
  Category,
  Static,
  Menu,
};
