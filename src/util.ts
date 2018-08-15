import { AppState, CategoryState } from "./reducers/types";

// Gets the subcategories available to the user based on current selection
export function getAvailableSubcategories(state: AppState): Array<string | CategoryState> {
  if (state.selection.categoryIndex === undefined || state.config === undefined) {
    return [];
  }
  let subcategories = state.config.categories[state.selection.categoryIndex].subcategories;
  state.selection.subcategoryIndices.forEach(index => {
    subcategories = (subcategories[index] as CategoryState).subcategories;
  });
  return subcategories;
}

export async function logActivity(url: string, category: string, subcategory: string) {
  const formData = new FormData();
  formData.append("Category", category);
  formData.append("Subcategory", subcategory);
  const response = await fetch(url, {
    method: "POST",
    body: formData
  });
  const data = await response.json();
  return data.success;
}