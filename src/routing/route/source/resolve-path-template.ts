type PathParamValue = string | number | boolean;
type PathParams = Record<string, PathParamValue>;
type PathSegment =
  | {
      kind: 'static';
      value: string;
    }
  | {
      kind: 'param';
      key: string;
    };

export function resolvePathTemplate(pathTemplate: string, params: PathParams = {}): string {
  return createPathTemplateResolver(pathTemplate)(params);
}

export function createPathTemplateResolver(pathTemplate: string): (params?: PathParams) => string {
  const segments = parsePathTemplate(pathTemplate);

  return (params: PathParams = {}) => {
    let path = '';

    for (const segment of segments) {
      if (segment.kind === 'static') {
        path += segment.value;
        continue;
      }

      const value = params[segment.key];

      if (value === undefined) {
        throw new Error(`Missing required path parameter: ${segment.key}.`);
      }

      path += encodeURIComponent(String(value));
    }

    return path;
  };
}

function parsePathTemplate(pathTemplate: string): PathSegment[] {
  const segments: PathSegment[] = [];
  const pattern = /:([A-Za-z0-9_]+)/g;
  let lastIndex = 0;

  for (const match of pathTemplate.matchAll(pattern)) {
    const index = match.index as number;
    const placeholder = match[0];
    const key = match[1] as string;

    if (index > lastIndex) {
      segments.push({
        kind: 'static',
        value: pathTemplate.slice(lastIndex, index),
      });
    }

    segments.push({
      kind: 'param',
      key,
    });

    lastIndex = index + placeholder.length;
  }

  if (lastIndex < pathTemplate.length) {
    segments.push({
      kind: 'static',
      value: pathTemplate.slice(lastIndex),
    });
  }

  if (segments.length === 0) {
    return [
      {
        kind: 'static',
        value: pathTemplate,
      },
    ];
  }

  return segments;
}
