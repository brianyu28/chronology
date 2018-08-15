import { ActionType } from "typesafe-actions";
import * as actions from "../actions/actions";

export interface AppState {
  config: ConfigState | undefined,
  selection: SelectionState
}

export interface ConfigState {
  url: string,
  categories: CategoryState[]
}

export interface CategoryState {
  name: string,
  subcategories: Array<string | CategoryState>,
  color?: string | [string, string]
}

export interface SelectionState {
  categoryIndex: number | undefined;
  subcategoryIndices: number[];
}

export const defaultState: AppState = {
  config: undefined,
  selection: {
    categoryIndex: undefined,
    subcategoryIndices: []
  }
};

export type Action = ActionType<typeof actions>;

export type Dispatch = (action: Action) => void;