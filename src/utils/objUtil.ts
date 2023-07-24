export const cleanObject = (obj: object): object => {
  const filteredObj = Object.fromEntries(
    Object.entries(obj).filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, value]) => value !== undefined && value !== ''
    )
  );

  return filteredObj;
};

export interface objectFilter {
  [key: string]: string | number;
}

export const objectFilter = (
  obj: objectFilter,
  ...options: Array<string>
): object => {
  const newObjc: objectFilter = {};
  Object.keys(obj).forEach(el => {
    if (options.includes(el)) {
      newObjc[el] = obj[el];
    }
  });

  return newObjc;
};
