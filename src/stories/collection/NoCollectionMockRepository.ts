import { CollectionItemsPaginationInfo } from '@/collection/domain/models/CollectionItemsPaginationInfo'
import { CollectionItemSubset } from '@/collection/domain/models/CollectionItemSubset'
import { CollectionSearchCriteria } from '@/collection/domain/models/CollectionSearchCriteria'
import { FakerHelper } from '../../../tests/component/shared/FakerHelper'
import { Collection } from '../../collection/domain/models/Collection'
import { CollectionFacet } from '../../collection/domain/models/CollectionFacet'
import { CollectionMockRepository } from './CollectionMockRepository'

export class NoCollectionMockRepository extends CollectionMockRepository {
  getById(_id: string): Promise<Collection> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Collection not found')
      }, FakerHelper.loadingTimout())
    })
  }

  getFacets(_collectionIdOrAlias: number | string): Promise<CollectionFacet[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([])
      }, FakerHelper.loadingTimout())
    })
  }

  getItems(
    _collectionId: string,
    _paginationInfo: CollectionItemsPaginationInfo,
    _searchCriteria?: CollectionSearchCriteria
  ): Promise<CollectionItemSubset> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          items: [],
          totalItemCount: 0
        })
      }, FakerHelper.loadingTimout())
    })
  }
}
