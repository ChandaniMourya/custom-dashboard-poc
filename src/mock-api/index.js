function delay(ms = 500) {

  return new Promise((resolve) => setTimeout(resolve, ms));

}

export async function getDashboardMetadata(dashboardId) {
  await delay();
  const dashboards = await fetch("/data/dashboardMetaData.json");
  const data = await dashboards.json();

  if (data.dashboardConfig.dashboardId !== dashboardId)
    throw new Error("Dashboard not found");

  return data.dashboardConfig.config;
}

export async function getData(definitionId) {

  await delay();
  const queries = await fetch("/data/responseMetaData.json");
  const data = await queries.json();
  const query = data.find(item => item[definitionId]);
  return query;

}