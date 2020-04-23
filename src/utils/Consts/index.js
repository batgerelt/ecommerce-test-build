const EncryptKey = "Emart1Mall2Encrypt3Key";

const CARD_TYPES = {
  slim: 1,
  wide: 2,
  tile: 3,
  list: 4,
};
Object.freeze(CARD_TYPES);

const CARD_NUMS_IN_ROW = {
  wide: 3,
  slim: 5,
};
Object.freeze(CARD_NUMS_IN_ROW);

const CARD_LIST_TYPES = {
  horizontal: 1,
  vertical: 2,
  list: 3,
};
Object.freeze(CARD_LIST_TYPES);

const WIDGET_SLUGS = {
  onlyemart: "onlyemart",
  discount: "discount",
  recipe: "recipe",
  package: "package",
  new: "new",
  dailydeal: "dailydeal",
};
Object.freeze(WIDGET_SLUGS);

const LABEL_TYPES = {
  horizontal: 1,
  vertical: 2,
};
Object.freeze(CARD_LIST_TYPES);

const PRODUCTS_PER_PAGE = 20;
/* Here is your client ID: O23leWRUHkvqDWiHcThRXtCl */
const SOCIAL_IDS = {
  google: "885941849583-fai2isc5scoteqf4s50b0aee1s6cku39.apps.googleusercontent.com",
  // Real
  facebook: "1438714326447694",
};
Object.freeze(SOCIAL_IDS);

export {
  CARD_TYPES,
  CARD_NUMS_IN_ROW,
  CARD_LIST_TYPES,
  WIDGET_SLUGS,
  LABEL_TYPES,
  PRODUCTS_PER_PAGE,
  SOCIAL_IDS,
  EncryptKey,
};
