import { Home } from '../../../../src/sections/home/Home'
import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { DatasetPreviewMother } from '../../dataset/domain/models/DatasetPreviewMother'
import { UserMother } from '../../users/domain/models/UserMother'
import { UserRepository } from '../../../../src/users/domain/repositories/UserRepository'
import { SessionProvider } from '../../../../src/sections/session/SessionProvider'

const testUser = UserMother.create()
const userRepository: UserRepository = {} as UserRepository
const datasetRepository: DatasetRepository = {} as DatasetRepository
const totalDatasetsCount = 10
const datasets = DatasetPreviewMother.createMany(totalDatasetsCount)
describe('Home page', () => {
  beforeEach(() => {
    datasetRepository.getAll = cy.stub().resolves(datasets)
    datasetRepository.getTotalDatasetsCount = cy.stub().resolves(totalDatasetsCount)
  })

  it('renders Root title', () => {
    cy.customMount(<Home datasetRepository={datasetRepository} />)
    cy.findByRole('heading').should('contain.text', 'Root')
  })

  it('does not render the Add Data dropdown button', () => {
    cy.customMount(<Home datasetRepository={datasetRepository} />)
    cy.findByText('Add Data').should('not.exist')
  })

  before(() => {
    userRepository.getAuthenticated = cy.stub().resolves(testUser)
    userRepository.removeAuthenticated = cy.stub().resolves()
  })
  it('does render the Add Data dropdown button when user logged in', () => {
    cy.customMount(
      <SessionProvider repository={userRepository}>
        <Home datasetRepository={datasetRepository} />
      </SessionProvider>
    )
    cy.wrap(userRepository.getAuthenticated).should('be.calledOnce')

    cy.findByRole('button', { name: /Add Data/i }).should('exist')
    cy.findByRole('button', { name: /Add Data/i }).click()
    cy.findByText('New Dataverse').should('be.visible')
    cy.findByText('New Dataset').should('be.visible')
  })

  it('renders the datasets list', () => {
    cy.customMount(<Home datasetRepository={datasetRepository} />)

    cy.wrap(datasetRepository.getAll).should('be.calledOnce')

    datasets.forEach((dataset) => {
      cy.findByText(dataset.version.title).should('exist')
    })
  })
})
