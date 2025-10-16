import { types } from "util";

export type IWidgetTrend = {
  trendvalueDefinition: string;
  positiveColor?: string;
  negativeColor?: string;
  neutralColor?: string;
}

export type IWidgetConfig ={
  valueDefinition: string;
  unit?: string;
  decimalPlaces?: number;
  color?: string;
  type?: string; 
  lowerBound?: number;
  upperBound?: number;
  colorAbove?: string;
  colorBelow?: string;
  trend?: IWidgetTrend;
}

export type IWidget = {
  widgetId: string;
  label: string;
  config: IWidgetConfig;
}
export type TableColumn ={
  key: string;
  label: string;
}

export type IDefinition = {
  definitionId: string;
  typeId: string;  
  queryId: string[];   
  config: {
    widgets?: IWidget[];
    valueDefinition?: string;
    columns?: TableColumn[];
  };
}

export interface ISection {
  definition: IDefinition;
  config : IConfig;
  params?: Record<string, any>;
  label?: string;
}

// Use type here instead of interface.
export type IConfig = {
    sectionId: string;
    definitionId: string;
    label: string;
    enabled?: string[];      
    tableRowLimit?: number;  
}
