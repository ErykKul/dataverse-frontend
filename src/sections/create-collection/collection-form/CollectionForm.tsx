import { MouseEvent, useMemo, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Alert, Button, Card, Stack } from '@iqss/dataverse-design-system'
import { CollectionRepository } from '../../../collection/domain/repositories/CollectionRepository'
import {
  CollectionType,
  CollectionStorage
} from '../../../collection/domain/useCases/DTOs/CollectionDTO'
import { SeparationLine } from '../../shared/layout/SeparationLine/SeparationLine'
import { SubmissionStatus, useSubmitCollection } from './useSubmitCollection'
import { TopFieldsSection } from './top-fields-section/TopFieldsSection'
import { MetadataFieldsSection } from './metadata-fields-section/MetadataFieldsSection'
import { BrowseSearchFacetsSection } from './browse-search-facets-section/BrowseSearchFacetsSection'
import { MetadataBlockName } from '../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { MetadataBlockInfoRepository } from '../../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import styles from './CollectionForm.module.scss'

export const METADATA_BLOCKS_NAMES_GROUPER = 'metadataBlockNames'
export const USE_FIELDS_FROM_PARENT = 'useFieldsFromParent'
export const INPUT_LEVELS_GROUPER = 'inputLevels'

export interface CollectionFormProps {
  collectionRepository: CollectionRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  ownerCollectionId: string
  defaultValues: CollectionFormData
}

export type CollectionFormData = {
  hostCollection: string
  name: string
  affiliation: string
  alias: string
  storage: CollectionStorage
  type: CollectionType | ''
  description: string
  contacts: { value: string }[]
  [USE_FIELDS_FROM_PARENT]: boolean
  [METADATA_BLOCKS_NAMES_GROUPER]: CollectionFormMetadataBlocks
  [INPUT_LEVELS_GROUPER]?: FormattedCollectionInputLevels
}

export type CollectionFormMetadataBlocks = Omit<
  Record<MetadataBlockName, boolean>,
  'codeMeta20' | 'computationalworkflow'
>

export type FormattedCollectionInputLevels = {
  [key: string]: {
    include: boolean
    optionalOrRequired: CollectionFormInputLevelValue
  }
}

export const CollectionFormInputLevelOptions = {
  OPTIONAL: 'optional',
  REQUIRED: 'required'
} as const

export type CollectionFormInputLevelValue =
  (typeof CollectionFormInputLevelOptions)[keyof typeof CollectionFormInputLevelOptions]

// On the submit function callback, type is CollectionType as type field is required and wont never be ""
export type CollectionFormValuesOnSubmit = Omit<CollectionFormData, 'type'> & {
  type: CollectionType
}

export const CollectionForm = ({
  collectionRepository,
  metadataBlockInfoRepository,
  ownerCollectionId,
  defaultValues
}: CollectionFormProps) => {
  const formContainerRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation('createCollection')
  const navigate = useNavigate()

  const { submitForm, submitError, submissionStatus } = useSubmitCollection(
    collectionRepository,
    ownerCollectionId,
    onSubmittedCollectionError
  )

  const form = useForm<CollectionFormData>({
    mode: 'onChange',
    defaultValues
  })

  const { formState } = form

  console.log({ defaultValues })
  // console.log(watch('inputLevels'))

  const preventEnterSubmit = (e: React.KeyboardEvent<HTMLFormElement | HTMLButtonElement>) => {
    // When pressing Enter, only submit the form  if the user is focused on the submit button itself
    if (e.key !== 'Enter') return

    const isButton = e.target instanceof HTMLButtonElement
    const isButtonTypeSubmit = isButton ? (e.target as HTMLButtonElement).type === 'submit' : false

    if (!isButton && !isButtonTypeSubmit) e.preventDefault()
  }

  function onSubmittedCollectionError() {
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleCancel = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    navigate(-1)
  }

  const disableSubmitButton = useMemo(() => {
    return submissionStatus === SubmissionStatus.IsSubmitting || !formState.isDirty
  }, [submissionStatus, formState.isDirty])

  return (
    <div
      className={styles['form-container']}
      ref={formContainerRef}
      data-testid="collection-form-container">
      {submissionStatus === SubmissionStatus.Errored && (
        <Alert variant={'danger'} dismissible={false}>
          {submitError}
        </Alert>
      )}
      {submissionStatus === SubmissionStatus.SubmitComplete && (
        <Alert variant="success" dismissible={false}>
          {t('submitStatus.success')}
        </Alert>
      )}
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          onKeyDown={preventEnterSubmit}
          noValidate={true}
          data-testid="collection-form">
          <TopFieldsSection />

          <SeparationLine />

          <Stack>
            <Card>
              <Card.Body>
                <MetadataFieldsSection metadataBlockInfoRepository={metadataBlockInfoRepository} />
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <BrowseSearchFacetsSection />
              </Card.Body>
            </Card>
          </Stack>

          <Stack direction="horizontal" className="pt-3">
            <Button type="submit">{t('formButtons.save')}</Button>
            {/* <Button type="submit" disabled={disableSubmitButton}>
              {t('formButtons.save')}
            </Button> */}
            <Button
              variant="secondary"
              type="button"
              onClick={handleCancel}
              disabled={submissionStatus === SubmissionStatus.IsSubmitting}>
              {t('formButtons.cancel')}
            </Button>
          </Stack>
        </form>
      </FormProvider>
    </div>
  )
}
