import { MetadataBlockInfoDisplayFormat, MetadataBlockInfo } from '../models/MetadataBlockInfo'

export interface MetadataBlockInfoRepository {
  getByName: (name: string) => Promise<MetadataBlockInfoDisplayFormat | undefined>
  getAll: () => Promise<MetadataBlockInfo[]>
  getDisplayedOnCreateByCollectionId: (
    collectionId: number | string
  ) => Promise<MetadataBlockInfo[]>
  getByCollectionId: (collectionId: number | string) => Promise<MetadataBlockInfo[]>
}
