import { zefCreateFromAction } from '../core';

export function createFromAction(action: any, nProps: any) {
  return zefCreateFromAction(action, {
    ...nProps,
    type: createTag(action.entityName, nProps.op || action.op),
    entityName: action.entityName
  });
}

export function createTag(entity: string, op: string) {
  return `[@zerops/zef/entities/${entity}] ${op}`;
}
