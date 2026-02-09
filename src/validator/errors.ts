export class UnknownConstraintError extends Error {
  constructor(field: string, constraint: string) {
    super(`Field "${field}" references unregistered constraint "${constraint}".`);
    this.name = 'UnknownConstraintError';
  }
}
