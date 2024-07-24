import { CollectionRepository } from '../../../../src/collection/domain/repositories/CollectionRepository'
import { CreateCollection } from '../../../../src/sections/create-collection/CreateCollection'
import { UserRepository } from '../../../../src/users/domain/repositories/UserRepository'
import { CollectionMother } from '../../collection/domain/models/CollectionMother'
import { UserMother } from '../../users/domain/models/UserMother'

const collectionRepository: CollectionRepository = {} as CollectionRepository

const COLLECTION_NAME = 'Collection Name'
const collection = CollectionMother.create({ name: COLLECTION_NAME })

const testUser = UserMother.create()
const userRepository: UserRepository = {} as UserRepository

describe('CreateCollection', () => {
  beforeEach(() => {
    collectionRepository.create = cy.stub().resolves(1)
    collectionRepository.getById = cy.stub().resolves(collection)
    userRepository.getAuthenticated = cy.stub().resolves(testUser)
  })

  it('should show loading skeleton while loading the owner collection', () => {
    cy.customMount(
      <CreateCollection collectionRepository={collectionRepository} ownerCollectionId="root" />
    )

    cy.findByTestId('create-collection-skeleton').should('exist')
  })

  it('should render the correct breadcrumbs', () => {
    cy.customMount(
      <CreateCollection collectionRepository={collectionRepository} ownerCollectionId="root" />
    )

    cy.findByRole('link', { name: 'Root' }).should('exist')

    cy.get('li[aria-current="page"]')
      .should('exist')
      .should('have.text', 'Create Collection')
      .should('have.class', 'active')
  })

  it('should show page not found when owner collection does not exist', () => {
    collectionRepository.getById = cy.stub().resolves(null)

    cy.customMount(
      <CreateCollection collectionRepository={collectionRepository} ownerCollectionId="root" />
    )

    cy.findByText('Page Not Found').should('exist')
  })

  it('pre-fills specific form fields with user data', () => {
    cy.mountAuthenticated(
      <CreateCollection collectionRepository={collectionRepository} ownerCollectionId="root" />
    )

    cy.findByLabelText(/^Collection Name/i).should(
      'have.value',
      `${testUser.displayName} Collection`
    )

    cy.findByLabelText(/^Affiliation/i).should('have.value', testUser.affiliation)

    cy.findByLabelText(/^Email/i).should('have.value', testUser.email)
  })
})
