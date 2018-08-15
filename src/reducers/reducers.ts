import { getType } from "typesafe-actions";
import { Action, AppState } from "./types";

import * as actions from "../actions/actions";

export default (state: AppState, action: Action) => {
  switch (action.type) {
    case getType(actions.setConfig):
      return {
        ...state,
        config: action.payload.config,
        selection: {
          categoryIndex: undefined,
          subcategoryIndices: []
        }
      };
    case getType(actions.resetConfig):
      return {
        ...state,
        config: undefined,
        selection: {
          categoryIndex: undefined,
          subcategoryIndices: []
        }
      };
    case getType(actions.chooseCategory):
      return {
        ...state,
        selection: {
          categoryIndex: action.payload.categoryIndex,
          subcategoryIndices: []
        }
      };
    case getType(actions.chooseSubcategory):
      return {
        ...state,
        selection: {
          ...state.selection,
          subcategoryIndices: [...state.selection.subcategoryIndices, action.payload.subcategoryIndex]
        }
      };
    case getType(actions.cancelSelection):
      return {
        ...state,
        selection: {
          categoryIndex: undefined,
          subcategoryIndices: []
        }
      };
    default:
      return state;
  }
}



