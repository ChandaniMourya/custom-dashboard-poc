export interface IWidgetTrend {
  trendvalueDefinition: string;
  positiveColor?: string;
  negativeColor?: string;
  neutralColor?: string;
}

export interface IWidgetConfig {
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

export interface IWidget {
  widgetId: string;
  label: string;
  config: IWidgetConfig;
}

export interface IDefinition {
  definitionId: string;
  typeId: string;  
  queryId: string[];   
  config: {
    widgets: IWidget[];
  };
}

export interface ISection {
  definition: IDefinition;
  config: {
    sectionId: string;
    definitionId: string;
    label: string;
    enabled?: string[];      
    tableRowLimit?: number;  
  };
  params: Record<string, any>; 
}
