import { ForwardedRef, forwardRef } from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import cn from 'classnames'
import { type CollectionItem } from '../../../../collection/domain/models/CollectionItemSubset'
import { CollectionItemsPaginationInfo } from '../../../../collection/domain/models/CollectionItemsPaginationInfo'
import { PaginationResultsInfo } from '../../../shared/pagination/PaginationResultsInfo'
import { ErrorItemsMessage } from './ErrorItemsMessage'
import { NoItemsMessage } from './NoItemsMessage'
import { NoSearchMatchesMessage } from './NoSearchMatchesMessage'
import { NO_COLLECTION_ITEMS } from '../useGetAccumulatedItems'
import styles from './ItemsList.module.scss'

interface ItemsListProps {
  items: CollectionItem[]
  error: string | null
  accumulatedCount: number
  isLoadingItems: boolean
  areItemsAvailable: boolean
  hasNextPage: boolean
  isEmptyItems: boolean
  hasSearchValue: boolean
  paginationInfo: CollectionItemsPaginationInfo
  onBottomReach: (paginationInfo: CollectionItemsPaginationInfo) => void
}

export const ItemsList = forwardRef(
  (
    {
      items,
      error,
      accumulatedCount,
      isLoadingItems,
      areItemsAvailable,
      hasNextPage,
      isEmptyItems,
      hasSearchValue,
      paginationInfo,
      onBottomReach
    }: ItemsListProps,
    ref
  ) => {
    const [sentryRef, { rootRef }] = useInfiniteScroll({
      loading: isLoadingItems,
      hasNextPage: hasNextPage,
      onLoadMore: () => void onBottomReach(paginationInfo),
      disabled: !!error,
      rootMargin: '0px 0px 250px 0px'
    })

    const showNoItemsMessage = !isLoadingItems && isEmptyItems && !hasSearchValue
    const showNoSearchMatchesMessage = !isLoadingItems && isEmptyItems && hasSearchValue

    const showSentrySkeleton = hasNextPage && !error && !isEmptyItems
    const showNotSentrySkeleton = isLoadingItems && isEmptyItems

    return (
      <section ref={rootRef}>
        <div
          className={cn(styles['items-list'], {
            [styles['empty-or-error']]: isEmptyItems || error
          })}
          ref={ref as ForwardedRef<HTMLDivElement>}>
          {showNoItemsMessage && <NoItemsMessage />}
          {showNoSearchMatchesMessage && <NoSearchMatchesMessage />}

          {error && <ErrorItemsMessage errorMessage={error} />}

          {areItemsAvailable && (
            <>
              <header>
                {isLoadingItems ? (
                  <SkeletonTheme>
                    <Skeleton height={19} width={190} />
                  </SkeletonTheme>
                ) : (
                  <PaginationResultsInfo
                    paginationInfo={paginationInfo}
                    accumulated={accumulatedCount}
                  />
                )}
              </header>

              {/* TODO:ME After updating js-dataverse use case, assert by the type wich card to render */}
              <ul>
                {items.map((collectionItem, index) => {
                  // console.log(collectionItem)

                  return (
                    <li
                      style={{ height: 100, border: 'solid 2px black' }}
                      key={index}
                      // key={`${dataset.persistentId}-${dataset.version.id}`}
                    >
                      <p>
                        This is a : {collectionItem?.type === 'file' && 'File'}
                        {collectionItem?.type === 'dataset' && 'Dataset'}
                        {collectionItem?.type === 'collection' && 'Collection'}
                      </p>
                    </li>
                  )
                })}
              </ul>
            </>
          )}

          {showSentrySkeleton && (
            <div ref={sentryRef} data-testid="collection-items-list-infinite-scroll-skeleton">
              <SkeletonTheme>
                {accumulatedCount === NO_COLLECTION_ITEMS && <InitialLoadingSkeleton />}
                <LoadingSkeleton numOfSkeletons={3} />
              </SkeletonTheme>
            </div>
          )}
          {showNotSentrySkeleton && (
            <SkeletonTheme>
              <LoadingSkeleton numOfSkeletons={10} />
            </SkeletonTheme>
          )}
        </div>
      </section>
    )
  }
)

ItemsList.displayName = 'ItemsList'

export const InitialLoadingSkeleton = () => (
  <>
    <div
      className={styles['pagination-results-skeleton']}
      data-testid="collection-items-list-infinite-scroll-skeleton-header">
      <Skeleton width="17%" />
    </div>
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
  </>
)

export const LoadingSkeleton = ({ numOfSkeletons }: { numOfSkeletons: number }) => (
  <>
    {Array.from({ length: numOfSkeletons }).map((_, index) => (
      <Skeleton key={index} height="109px" style={{ marginBottom: 6 }} />
    ))}
  </>
)
