/**
 * @description 身高体重范围
 */
export const heightAndWeightRang = () => {
  const heightList = [];
  const weightList = [];
  let w = 0;
  let h = 0;
  for (let i = 120; i <= 230; i++) {
    const obj = {
      value: w++,
      label: `${i}cm`
    };
    heightList.push(obj);
  }
  for (let i = 25; i <= 205; i++) {
    const obj = {
      value: h++,
      label: `${i}kg`
    };
    weightList.push(obj);
  }
  return [heightList, weightList];
};
