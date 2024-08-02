import { MetadataBlockInfoDisplayFormat, MetadataBlockInfo } from '../models/MetadataBlockInfo'

export interface MetadataBlockInfoRepository {
  getByName: (name: string) => Promise<MetadataBlockInfoDisplayFormat | undefined>
  getAllTemporal: (names: string[]) => Promise<MetadataBlockInfo[]>
  getDisplayedOnCreateByCollectionId: (
    collectionId: number | string
  ) => Promise<MetadataBlockInfo[]>
  getByColecctionId: (collectionId: number | string) => Promise<MetadataBlockInfo[]>
}
