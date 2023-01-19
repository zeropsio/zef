import { Injectable } from '@angular/core';
import { DataService } from './entity-manager.model';
import { DefaultDataServiceFactory } from './default-data-service.service';

@Injectable({ providedIn: 'root' })
export class EntityStoreService {
  protected services: { [name: string]: DataService<any> } = {};

  constructor(protected defaultDataServiceFactory: DefaultDataServiceFactory) {}

  getService<T>(entityName: string): DataService<T> {
    entityName = entityName.trim();
    let service = this.services[entityName];
    if (!service) {
      service = this.defaultDataServiceFactory.create(entityName);
      this.services[entityName] = service;
    }
    return service;
  }

  registerService<T>(entityName: string, service: DataService<T>) {
    this.services[entityName.trim()] = service;
  }

  registerServices(services: { [name: string]: DataService<any> }) {
    this.services = { ...this.services, ...services };
  }

}
