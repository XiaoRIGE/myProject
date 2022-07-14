/**
 * @description 学校搜索
 */
export const searchSchool = (data, value) => {
  const arr = [];
  data.forEach(item => {
    if (item.name.includes(value)) {
      arr.push(item);
    }
  });
  return arr;
};
