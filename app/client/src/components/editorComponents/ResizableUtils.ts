import type { WidgetProps, WidgetRowCols } from "widgets/BaseWidget";
import { GridDefaults } from "constants/WidgetConstants";
import type { XYCord } from "pages/common/CanvasArenas/hooks/useRenderBlocksOnCanvas";
import { ReflowDirection } from "reflow/reflowTypes";
import { ResponsiveBehavior } from "utils/autoLayout/constants";

export type UIElementSize = { height: number; width: number };

export const RESIZABLE_CONTAINER_BORDER_THEME_INDEX = 1;

export type WidgetPosition = {
  rightColumn: number;
  leftColumn: number;
  bottomRow: number;
  topRow: number;
  parentRowSpace: number;
  parentColumnSpace: number;
};

export type WidgetExtendedPosition = WidgetPosition & {
  paddingOffset: number;
};

export const computeRowCols = (
  delta: UIElementSize,
  position: XYCord,
  props: WidgetPosition,
) => {
  return {
    leftColumn: Math.round(
      props.leftColumn + position.x / props.parentColumnSpace,
    ),
    topRow: Math.round(props.topRow + position.y / props.parentRowSpace),
    rightColumn: Math.round(
      props.rightColumn + (delta.width + position.x) / props.parentColumnSpace,
    ),
    bottomRow: Math.round(
      props.bottomRow + (delta.height + position.y) / props.parentRowSpace,
    ),
  };
};

export const computeBoundedRowCols = (rowCols: WidgetRowCols) => {
  return {
    leftColumn: Math.max(rowCols.leftColumn, 0),
    rightColumn: Math.min(
      rowCols.rightColumn,
      GridDefaults.DEFAULT_GRID_COLUMNS,
    ),
    topRow: rowCols.topRow,
    bottomRow: rowCols.bottomRow,
  };
};

export const hasRowColsChanged = (
  newRowCols: WidgetRowCols,
  props: WidgetProps,
) => {
  return (
    props.leftColumn !== newRowCols.leftColumn ||
    props.topRow !== newRowCols.topRow ||
    props.bottomRow !== newRowCols.bottomRow ||
    props.rightColumn !== newRowCols.rightColumn
  );
};

export const computeFinalRowCols = (
  delta: UIElementSize,
  position: XYCord,
  props: WidgetProps,
): WidgetRowCols | false => {
  const newRowCols = computeBoundedRowCols(
    computeRowCols(delta, position, props),
  );

  return hasRowColsChanged(newRowCols, props) ? newRowCols : false;
};

/**
 * A rudimentary function which based on horizontal and vertical resize enabled
 * tells us whether a resize handle in a particular direction works
 * Note: This works only if vertical or horizontal directions are provided.
 * @param horizontalEnabled : boolean
 * @param verticalEnabled : boolean
 * @param direction : ReflowDirection
 * @returns if resize is allowed in the direction provided
 * Works only for vertical and horizontal directions
 */
export function isHandleResizeAllowed(
  horizontalEnabled: boolean,
  verticalEnabled: boolean,
  direction?: ReflowDirection,
  isFlexChild?: boolean,
  responsiveBehavior?: ResponsiveBehavior,
): boolean {
  if (direction === ReflowDirection.TOP || direction === ReflowDirection.BOTTOM)
    return verticalEnabled;
  else if (
    direction === ReflowDirection.LEFT ||
    direction === ReflowDirection.RIGHT
  ) {
    return isFlexChild && responsiveBehavior === ResponsiveBehavior.Fill
      ? false
      : horizontalEnabled;
  }
  return true;
}
