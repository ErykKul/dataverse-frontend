import {
  Dataset as JSDataset,
  DatasetMetadataBlock as JSDatasetMetadataBlock,
  DatasetMetadataFields as JSDatasetMetadataFields,
  DatasetVersionInfo as JSDatasetVersionInfo
} from '@IQSS/dataverse-client-javascript'
import { DatasetVersionState as JSDatasetVersionState } from '@IQSS/dataverse-client-javascript/dist/datasets/domain/models/Dataset'
import {
  Dataset,
  DatasetStatus,
  MetadataBlockName,
  DatasetMetadataBlock,
  DatasetVersion,
  DatasetMetadataFields
} from '../../domain/models/Dataset'

export class DatasetMapper {
  static toModel(jsDataset: JSDataset, summaryFieldsNames: string[]): Dataset {
    return new Dataset.Builder(
      jsDataset.persistentId,
      DatasetMapper.toTitle(jsDataset.metadataBlocks),
      DatasetMapper.toVersion(jsDataset.versionInfo),
      DatasetMapper.toCitation(),
      DatasetMapper.toSummaryFields(jsDataset.metadataBlocks, summaryFieldsNames),
      jsDataset.license,
      DatasetMapper.toMetadataBlocks(jsDataset.metadataBlocks)
    )
  }

  static toTitle(jsDatasetMetadataBlocks: JSDatasetMetadataBlock[]): string {
    const citationFields = jsDatasetMetadataBlocks.find(
      (metadataBlock) => metadataBlock.name === MetadataBlockName.CITATION
    )?.fields

    if (citationFields && typeof citationFields.title === 'string') {
      return citationFields.title
    }

    throw new Error('Dataset title not found')
  }

  static toVersion(jsDatasetVersionInfo: JSDatasetVersionInfo): DatasetVersion {
    return new DatasetVersion(
      jsDatasetVersionInfo.majorNumber,
      jsDatasetVersionInfo.minorNumber,
      DatasetMapper.toStatus(jsDatasetVersionInfo.state)
    )
  }

  static toStatus(jsDatasetVersionState: JSDatasetVersionState): DatasetStatus {
    switch (jsDatasetVersionState) {
      case JSDatasetVersionState.DRAFT:
        return DatasetStatus.DRAFT
      case JSDatasetVersionState.DEACCESSIONED:
        return DatasetStatus.DEACCESSIONED
      case JSDatasetVersionState.RELEASED:
        return DatasetStatus.RELEASED
      default:
        return DatasetStatus.RELEASED
    }
  }

  static toCitation(): string {
    // TODO: Implement
    return ''
  }

  static toSummaryFields(
    jsDatasetMetadataBlocks: JSDatasetMetadataBlock[],
    summaryFieldsNames: string[]
  ): DatasetMetadataBlock[] {
    return jsDatasetMetadataBlocks.map((jsDatasetMetadataBlock) => {
      const getSummaryFields = (metadataFields: JSDatasetMetadataFields): DatasetMetadataFields => {
        return Object.keys(metadataFields).reduce((acc, metadataFieldName) => {
          if (summaryFieldsNames.includes(metadataFieldName)) {
            return {
              ...acc,
              [metadataFieldName]: metadataFields[metadataFieldName]
            }
          }
          return acc
        }, {})
      }

      return {
        name: DatasetMapper.toMetadataBlockName(jsDatasetMetadataBlock.name),
        fields: getSummaryFields(jsDatasetMetadataBlock.fields)
      }
    })
  }

  static toMetadataBlocks(
    jsDatasetMetadataBlocks: JSDatasetMetadataBlock[]
  ): DatasetMetadataBlock[] {
    return jsDatasetMetadataBlocks.map((jsDatasetMetadataBlock) => {
      return {
        name: DatasetMapper.toMetadataBlockName(jsDatasetMetadataBlock.name),
        fields: jsDatasetMetadataBlock.fields
      }
    })
  }

  static toMetadataBlockName(jsDatasetMetadataBlockName: string): MetadataBlockName {
    const metadataBlockNameKey = Object.values(MetadataBlockName).find((metadataBlockNameKey) => {
      return metadataBlockNameKey === jsDatasetMetadataBlockName
    })

    if (metadataBlockNameKey === undefined) {
      throw new Error('Incorrect Metadata block name key')
    }

    return metadataBlockNameKey
  }
}
