import { useTranslation } from 'react-i18next'
import { Alert, Col, Form, Row } from '@iqss/dataverse-design-system'
import { MetadataField } from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'

interface BrowseSearchFacetsSectionProps {
  allFacetableMetadataFields: MetadataField[]
}

export const BrowseSearchFacetsSection = ({
  allFacetableMetadataFields
}: BrowseSearchFacetsSectionProps) => {
  const { t } = useTranslation('createCollection')

  return (
    <Row>
      <Col lg={3}>
        <Form.Group.Label>{t('fields.browseSearchFacets.label')}</Form.Group.Label>
      </Col>
      <Col lg={9}>
        <Form.Group.Text>{t('fields.browseSearchFacets.helperText')}</Form.Group.Text>
        <Col className="mt-3">
          <Alert variant="info" dismissible={false} customHeading="Coming soon">
            Work in progress
          </Alert>
        </Col>
      </Col>
    </Row>
  )
}
