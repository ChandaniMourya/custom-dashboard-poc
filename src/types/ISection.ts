import { types } from "util";

export type WidgetTrend = {
  trendvalueDefinition: string;
  positiveColor?: string;
  negativeColor?: string;
  neutralColor?: string;
}

export type WidgetConfig ={
  valueDefinition: string;
  unit?: string;
  decimalPlaces?: number;
  color?: string;
  type?: string; 
  lowerBound?: number;
  upperBound?: number;
  colorAbove?: string;
  colorBelow?: string;
  trend?: WidgetTrend;
}

export type Widget = {
  widgetId: string;
  label: string;
  config: WidgetConfig;
}
export type TableColumn ={
  key: string;
  label: string;
}

export type Definition<T> = {
  definitionId: string;
  typeId: string;  
  queryId: string[];   
  config: T;
}

export type MetricDefinition = {
  widgets: Widget[];
}

export type TableDefinition = {
  columns: TableColumn[];
  valueDefinition?: string;
}

export interface ISection<T = MetricDefinition | TableDefinition> {
  definition: Definition<T>;
  config : Config;
  params?: Record<string, any>;
  label?: string;
}

// Use type here instead of interface.
export type Config = {
    sectionId: string;
    definitionId: string;
    label: string;
    enabled?: string[];      
    tableRowLimit?: number;  
}
