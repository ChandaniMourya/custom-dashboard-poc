import React from 'react';
import { getValueByPath } from '../../sections/metric_section';
import MetricWidget from '../widget/metric_widget';
import { useMasterMetadata } from '../../context/master_metadata_context';
const MetricDisplay = ({  section, responseData
}) => {

    const { masterMetadata, error } = useMasterMetadata();

      const definition = masterMetadata?.definitions?.find(
  def => def.definitionId === section.definitionId
);
  return definition.config.widgets.
                  filter(widget => section.config.enabled?.includes(widget.widgetId)).map((widget, index) => {
                    const base = responseData?.[section.definitionId];
                    const value = getValueByPath(base, widget.valueDefinition);
                    const data = {label: widget.label,value: value};
                    return <MetricWidget key={index} widget={data} />;
                  });
};

export default MetricDisplay;
