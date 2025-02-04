import { SummaryFields } from './SummaryFields'
import { DatasetLicense, DatasetMetadataBlock } from '../../../dataset/domain/models/Dataset'
import { License } from './License'
import { MetadataBlockInfoRepository } from '../../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'

interface DatasetSummaryProps {
  summaryFields: DatasetMetadataBlock[]
  license: DatasetLicense
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

export function DatasetSummary({
  summaryFields,
  license,
  metadataBlockInfoRepository
}: DatasetSummaryProps) {
  return (
    <>
      <SummaryFields
        summaryFields={summaryFields}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
      <License license={license} />
    </>
  )
}
