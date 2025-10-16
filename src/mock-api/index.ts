function delay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getDashboardMetadata(dashboardId: string): Promise<any> {
  await delay();
  const dashboards = await fetch("/data/dashboardMetaData.json");
  const data = await dashboards.json();

  if (data.dashboardConfig.dashboardId !== dashboardId)
    throw new Error("Dashboard not found");

  return data.dashboardConfig.config;
}

export async function getData(definitionId: string): Promise<any> {
  await delay();
  const queries = await fetch("/data/responseMetaData.json");
  const data = await queries.json();
  const query = data.find((item: any) => item[definitionId]);
  return query;
}

export async function getDefinitionById(definitionId: string): Promise<any> {
  await delay();
  const definitions = await fetch("/data/definitionsMetaData.json");
  const data = await definitions.json();
  return data.definitions.find((item: any) => item.definitionId === definitionId);
}