type PathParamValue = string | number | boolean;

export function resolvePathTemplate(pathTemplate: string, params: Record<string, PathParamValue> = {}): string {
  return pathTemplate.replace(/:([A-Za-z0-9_]+)/g, (_match, key: string) => {
    const value = params[key];

    if (value === undefined) {
      throw new Error(`Missing required path parameter: ${key}.`);
    }

    return encodeURIComponent(String(value));
  });
}
