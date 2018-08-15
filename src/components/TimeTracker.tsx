import * as React from "react";
import { connect } from "react-redux";
import { Hotkey, Hotkeys, HotkeysTarget, Toaster, Position, Intent, Spinner } from "@blueprintjs/core";
import { AppState, CategoryState, ConfigState, Dispatch, SelectionState } from "../reducers/types";

import "../css/TimeTracker.css";
import { chooseCategory, cancelSelection, chooseSubcategory, resetConfig } from "../actions/actions";
import { getAvailableSubcategories, logActivity } from "../util";

interface TimeTrackerProps {
  categories: CategoryState[];
  selection: SelectionState;
  state: AppState;
  url: string;
  resetConfig: () => void;
  cancelSelection: () => void;
  chooseCategory: (categoryIndex: number) => null;
  chooseNextSubcategory: (subcategoryIndex: number) => null;
}

interface TimeTrackerState {
  isSubmitting: boolean;
  submissionIdentifier: string;
}

@HotkeysTarget
class TimeTracker extends React.Component<TimeTrackerProps, TimeTrackerState> {

  constructor(props: TimeTrackerProps) {
    super(props);
    this.state = {
      isSubmitting: false,
      submissionIdentifier: ""
    }
  }

  public renderHotkeys() {
    const numberHotkeys = [1,2,3,4,5,6,7,8,9,0].map((num, index) => {
      return (
        <Hotkey
          key={num}
          global={true}
          combo={num.toString()}
          label={num.toString()}
          onKeyDown={() => this.handleHotkeyIndexPress(index)}
        /> 
      );
    });
    return (
      <Hotkeys>
        {numberHotkeys}
        <Hotkey global={true} combo="c" label="Cancel" onKeyDown={this.props.cancelSelection} />
        <Hotkey global={true} combo="." label="Cancel" onKeyDown={this.props.cancelSelection} />
        <Hotkey global={true} combo="shift + c" label="Reset Config" onKeyDown={this.props.resetConfig} />
        <Hotkey global={true} combo="shift + ." label="Reset Config" onKeyDown={this.props.resetConfig} />
      </Hotkeys>
    );
  }

  public render() {
    const { selection } = this.props;
    const { isSubmitting } = this.state;
    return (
      <div className="time-tracker">
        <h2>{this.renderTitle()}</h2>
        { isSubmitting ?
          this.renderSubmitting() : 
          selection.categoryIndex === undefined ? 
          this.renderCategories() :
          this.renderSubcategories()
        }
      </div>
    );
  }

  private renderSubmitting() {
    const { submissionIdentifier } = this.state;
    return (
      <div>
        <Spinner size={Spinner.SIZE_STANDARD} />
        <br /><br />
        Submitting {submissionIdentifier}...
      </div>
    );
  }

  private renderTitle() {
    const { selection } = this.props;
    if (selection.categoryIndex === undefined) {
      return "Chronology";
    } else {
      return this.props.categories[selection.categoryIndex].name;
    }
  }

  private handleHotkeyIndexPress = (index: number) => {
    const { categories, selection } = this.props;
    if (selection.categoryIndex === undefined && categories.length > index) {
      this.props.chooseCategory(index);
    } else {
      const subcategories = getAvailableSubcategories(this.props.state);
      if (subcategories.length <= index) {
        return;
      }
      if (typeof(subcategories[index]) === "string") {
        this.logActivityForSubcategory(subcategories[index] as string);
      } else {
        this.props.chooseNextSubcategory(index);
      }
    }
  }

  private renderCategories() {
    const categories = this.props.categories.map((category, index) => {
      const style: any = {};
      if (category.color) {
        console.log(category.color);
        if (typeof(category.color) === "string") {
          style.backgroundColor = category.color;
        } else {
          const [color1, color2] = category.color;
          style.background = `linear-gradient(to right, ${color1}, ${color2})`;
        }
        console.log(style);
      }
      return (
        <div
          className="time-tracker-category"
          key={category.name}
          onClick={this.handleCategorySelection}
          data-index={index}
          style={style}
        >
          {category.name}
        </div>
      );
    });
    return (
      <div className="time-tracker-categories">
        {categories}
        <div className="time-tracker-category" onClick={this.props.resetConfig}>
          Reset
        </div>
      </div>
    );
  }

  private handleCategorySelection = (evt: React.MouseEvent<HTMLDivElement>) => {
    const categoryIndex = (evt.target as any).dataset.index;
    this.props.chooseCategory(categoryIndex);
  }

  private renderSubcategories() {
    const subcategories = getAvailableSubcategories(this.props.state);
    const subcategoryView = subcategories.map((subcategory, index) => {
      if (typeof(subcategory) === "string") {
        return (
          <div
            className="time-tracker-subcategory"
            key={subcategory}
            data-subcategory={subcategory}
            onClick={this.handleEventSelection}
          >
            {subcategory}
          </div>
        );
      } else {
        return (
          <div
            className="time-tracker-subcategory"
            key={subcategory.name}
            onClick={this.handleSubcategorySelection}
            data-index={index}
          >
            {subcategory.name}
          </div>
        );
      }
    });
    return (
      <div className="time-tracker-subcategories">
        {subcategoryView}
        <div className="time-tracker-subcategory" onClick={this.props.cancelSelection}>
          Cancel
        </div>
      </div>
    );
  }

  private handleSubcategorySelection = (evt: React.MouseEvent<HTMLDivElement>) => {
    const subcategoryIndex = (evt.target as any).dataset.index;
    this.props.chooseNextSubcategory(subcategoryIndex);
  }

  private handleEventSelection = (evt: React.MouseEvent<HTMLDivElement>) => {
    const subcategory = (evt.target as any).dataset.subcategory;
    this.logActivityForSubcategory(subcategory);
  }

  private logActivityForSubcategory = (subcategory: string) => {
    const category = this.props.categories[this.props.selection.categoryIndex as number].name;
    const submissionIdentifier = `${category} - ${subcategory}`;
    this.setState({ isSubmitting: true, submissionIdentifier });
    logActivity(this.props.url, category, subcategory)
    .then(() => {
      Toaster.create({
        position: Position.TOP_RIGHT,
      }).show({
        intent: Intent.SUCCESS,
        message: `Activity logged`,
        timeout: 1000
      });
      this.props.cancelSelection();
      this.setState({ isSubmitting: false, submissionIdentifier: "" });
    });
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    state,
    url: (state.config as ConfigState).url,
    categories: (state.config as ConfigState).categories,
    selection: state.selection
  };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    chooseCategory: (categoryIndex: number) => dispatch(chooseCategory(categoryIndex)),
    chooseNextSubcategory: (subcategoryIndex: number) => dispatch(chooseSubcategory(subcategoryIndex)),
    cancelSelection: () => dispatch(cancelSelection()),
    resetConfig: () => dispatch(resetConfig()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeTracker as any);