import { renderWithRouter } from '../../renderWithRouter'
import { HelloDataverse } from '../../../src/sections/hello-dataverse/HelloDataverse'
import { screen } from '@testing-library/react'
import { Layout } from '../../../src/sections/layout/Layout'

describe('Layout', () => {
  it('renders header and footer', () => {
    renderWithRouter(<Layout />)

    const header = screen.getByRole('heading', { name: 'title' })
    expect(header).toBeInTheDocument()

    const footer = screen.getByRole('footer', { name: 'copyright-and-privacy-policy' })
    expect(footer).toBeInTheDocument()
  })
})
