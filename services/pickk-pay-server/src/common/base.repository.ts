import { NotFoundException } from '@nestjs/common';
import { Repository, DeepPartial, FindOneOptions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { MultipleEntityReturnedException } from '@common/exceptions/multiple-entity-returned.exception';

import { BaseIdEntity } from './entities/base-id.entity';

export class BaseRepository<
  Entity extends BaseIdEntity
> extends Repository<Entity> {
  protected isEntity(obj: unknown): obj is Entity {
    return obj !== undefined && (obj as Entity).id !== undefined;
  }

  async get(id: number, relations: string[] = []): Promise<Entity | null> {
    return await this.findOne({
      where: { id },
      relations,
    })
      .then((entity) => {
        if (!this.isEntity(entity)) {
          throw new NotFoundException('Model not found.');
        }

        return Promise.resolve(entity);
      })
      .catch((error) => Promise.reject(error));
  }

  async createEntity(
    inputs: DeepPartial<Entity>,
    relations: string[] = []
  ): Promise<Entity | null> {
    return this.save(inputs)
      .then(async (entity) => await this.get((entity as any).id, relations))
      .catch((error) => Promise.reject(error));
  }

  async updateEntity(
    entity: Entity,
    inputs: QueryDeepPartialEntity<Entity>,
    relations: string[] = []
  ): Promise<Entity | null> {
    return this.update(entity.id, { ...inputs })
      .then(async () => await this.get(entity.id, relations))
      .catch((error) => Promise.reject(error));
  }

  async findOneEntity(
    param: FindOneOptions<Entity>['where'],
    relations: string[] = []
  ): Promise<Entity | null> {
    return await this.find({
      where: param,
      relations,
    }).then((entities) => {
      if (entities.length > 1) {
        throw new MultipleEntityReturnedException();
      }
      if (entities.length === 0 || !this.isEntity(entities[0])) {
        throw new NotFoundException('Entity가 존재하지 않습니다.');
      }

      return Promise.resolve(entities[0]);
    });
  }
}
