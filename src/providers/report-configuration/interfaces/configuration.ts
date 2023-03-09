export interface Configuration {
  id: string;
  nodeId?: string;
  configName: string;
  configData: Record<string, unknown>;
}
