import { Collection } from '../models/Collection'
import { CollectionFacet } from '../models/CollectionFacet'
import { CollectionDTO } from '../useCases/DTOs/CollectionDTO'

export interface CollectionRepository {
  getById: (id: string) => Promise<Collection>
  create(collection: CollectionDTO, hostCollection?: string): Promise<number>
  getFacets(collectionIdOrAlias: number | string): Promise<CollectionFacet[]>
}
