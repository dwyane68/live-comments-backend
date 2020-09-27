export const isEmptyObject = (obj: object): boolean => {
  return !Object.keys(obj).length;
};

export const containsKeywords = (keywords: Array<string>, str: string): boolean => {
  return keywords.some((keyword) => str.split(" ").includes(keyword));
}