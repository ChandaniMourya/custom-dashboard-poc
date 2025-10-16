// src/registry/sectionRegistry.ts
import MetricSection from '../sections/metric_section';
import TableSection from '../sections/table_section';
import { ISection} from '../types/ISection';

export const sectionRegistry: Record<string, React.FC<{ section: ISection<any> }>> = {
  "metric": MetricSection,
  "table": TableSection,
};
