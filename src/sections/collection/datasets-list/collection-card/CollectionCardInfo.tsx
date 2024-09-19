import { useParams } from 'react-router-dom'
import { Stack } from '@iqss/dataverse-design-system'
import { CollectionPreview } from '../../../../collection/domain/models/CollectionPreview'
import { DateHelper } from '../../../../shared/helpers/DateHelper'
import { DvObjectType } from '../../../../shared/hierarchy/domain/models/UpwardHierarchyNode'
import { Route } from '../../../Route.enum'
import { LinkToPage } from '../../../shared/link-to-page/LinkToPage'
import styles from './CollectionCard.module.scss'
import { ROOT_COLLECTION_ALIAS } from '../../../../collection/domain/models/Collection'

interface CollectionCardInfoProps {
  collectionPreview: CollectionPreview
}

export function CollectionCardInfo({ collectionPreview }: CollectionCardInfoProps) {
  const { collectionId = ROOT_COLLECTION_ALIAS } = useParams<{ collectionId: string }>()
  const isStandingOnParentCollectionPage = collectionPreview.parentCollectionAlias === collectionId

  return (
    <div className={styles['card-info-container']}>
      <Stack gap={1}>
        <div className={styles['date-link-wrapper']}>
          <time
            dateTime={collectionPreview.releaseOrCreateDate.toLocaleDateString()}
            className={styles.date}>
            {DateHelper.toDisplayFormat(collectionPreview.releaseOrCreateDate)}
          </time>
          {!isStandingOnParentCollectionPage && (
            <LinkToPage
              type={DvObjectType.COLLECTION}
              page={Route.COLLECTIONS}
              searchParams={{ id: collectionPreview.parentCollectionAlias.toString() }}>
              {collectionPreview.parentCollectionName}
            </LinkToPage>
          )}
        </div>

        {collectionPreview.description && (
          <p className={styles.description}>{collectionPreview.description}</p>
        )}
      </Stack>
    </div>
  )
}
