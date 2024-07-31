import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useCollection } from '../collection/useCollection'
import { CollectionRepository } from '../../collection/domain/repositories/CollectionRepository'
import { useLoading } from '../loading/LoadingContext'
import { useSession } from '../session/SessionContext'
import { RequiredFieldText } from '../shared/form/RequiredFieldText/RequiredFieldText'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { CollectionForm, CollectionFormData } from './collection-form/CollectionForm'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { CreateCollectionSkeleton } from './CreateCollectionSkeleton'

interface CreateCollectionProps {
  ownerCollectionId: string
  collectionRepository: CollectionRepository
}

export function CreateCollection({
  ownerCollectionId,
  collectionRepository
}: CreateCollectionProps) {
  const { t } = useTranslation('createCollection')
  const { isLoading, setIsLoading } = useLoading()
  const { user } = useSession()

  const { collection, isLoading: isLoadingCollection } = useCollection(
    collectionRepository,
    ownerCollectionId
  )

  useEffect(() => {
    if (!isLoadingCollection) {
      setIsLoading(false)
    }
  }, [isLoading, isLoadingCollection, setIsLoading])

  if (!isLoadingCollection && !collection) {
    return <PageNotFound />
  }

  if (isLoadingCollection || !collection) {
    return <CreateCollectionSkeleton />
  }

  const formDefaultValues: CollectionFormData = {
    hostCollection: collection.name,
    name: user?.displayName ? `${user?.displayName} Collection` : '',
    alias: '',
    type: '',
    contacts: [{ value: user?.email ?? '' }],
    affiliation: user?.affiliation ?? '',
    storage: 'Local (Default)',
    description: ''
  }

  return (
    <section>
      <BreadcrumbsGenerator
        hierarchy={collection?.hierarchy}
        withActionItem
        actionItemText={t('pageTitle')}
      />
      <header>
        <h1>{t('pageTitle')}</h1>
      </header>

      <SeparationLine />
      <RequiredFieldText />

      <CollectionForm
        collectionRepository={collectionRepository}
        ownerCollectionId={ownerCollectionId}
        defaultValues={formDefaultValues}
      />
    </section>
  )
}
