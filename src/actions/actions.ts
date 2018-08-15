import { createAction } from "typesafe-actions";
import { ConfigState } from "../reducers/types";

export const setConfig = createAction("config/set", resolve => {
  return (config: ConfigState) => resolve({ config });
});

export const chooseCategory = createAction("selection/category", resolve => {
  return (categoryIndex: number) => resolve({ categoryIndex });
});

export const chooseSubcategory = createAction("selection/subcategory", resolve => {
  return (subcategoryIndex: number) => resolve({ subcategoryIndex });
});

export const cancelSelection = createAction("selection/cancel", resolve => {
  return () => resolve();
});

export const resetConfig = createAction("config/reset", resolve => {
  return () => resolve();
});