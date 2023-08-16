import { Button } from '@iqss/dataverse-design-system'
import { PlusLg } from 'react-bootstrap-icons'
import { useSession } from '../../../session/SessionContext'

export function DatasetUploadFilesButton() {
  const { user } = useSession()
  const userHasDatasetUpdatePermissions = true // TODO - Implement permissions
  const datasetLockedFromEdits = false // TODO - Ask Guillermo if this a dataset property coming from the api
  const handleClick = () => {
    // TODO - Implement upload files
  }

  if (!user || !userHasDatasetUpdatePermissions) {
    return <></>
  }
  return (
    <Button onClick={handleClick} icon={<PlusLg />} disabled={datasetLockedFromEdits}>
      Upload Files
    </Button>
  )
}
