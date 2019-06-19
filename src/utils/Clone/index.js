/* eslint-disable consistent-return */
function clone(data, set) {
  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      return cloneArray(data, set);
    }
    return cloneObject(data, set);
  }
  return data;
}

function cloneArray(array, set) {
  if (array.length) {
    if (typeof array[0] === 'object') {
      if (Array.isArray(array[0])) {
        array.forEach((entry, index) => {
          set.push([]);
          set[index] = cloneArray(entry, set[index]);
        });
      } else {
        array.forEach((entry, index) => {
          set.push({});
          set[index] = cloneObject(entry, set[index]);
        });
      }
    } else {
      return [...array];
    }
  } else {
    return [];
  }
}

function cloneObject(obj, set) {
  if (Object.keys(obj).length) {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'object') {
        if (Array.isArray(obj[key])) {
          set[key] = [];
          set[key] = cloneArray(obj[key], set[key]);
        } else {
          set[key] = {};
          set[key] = cloneObject(obj[key], set[key]);
        }
      } else {
        set[key] = obj[key];
      }
    });
    return set;
  }
  return {};
}

export default clone;
