import { ChangeEventHandler, DragEventHandler, useEffect, useState } from 'react'
import { ProgressBar, Card } from 'react-bootstrap'
import { Button } from '@iqss/dataverse-design-system'
import { Plus, X } from 'react-bootstrap-icons'
import styles from './FileUploader.module.scss'
import React from 'react'
import { useTheme } from '@iqss/dataverse-design-system'
import { FileUploadTools, FileUploaderState } from '../../files/domain/models/FileUploadState'

export interface FileUploaderProps {
  upload: (files: File[]) => void
  cancelTitle: string
  info: string
  selectText: string
  fileUploaderState: FileUploaderState
  cancelUpload: (file: File) => void
}

export function FileUploader({
  upload,
  cancelTitle,
  info,
  selectText,
  fileUploaderState,
  cancelUpload
}: FileUploaderProps) {
  const theme = useTheme()
  const [files, setFiles] = useState<File[]>([])
  const [bgColor, setBackgroundColor] = useState(theme.color.primaryTextColor)

  const addFiles = (selectedFiles: FileList | null) => {
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles((alreadyAdded) => {
        const selectedFilesArray = Array.from(selectedFiles)
        const selectedFilesSet = new Set(selectedFilesArray.map((x) => FileUploadTools.key(x)))
        const alreadyAddedFiltered = alreadyAdded.filter(
          (x) => !selectedFilesSet.has(FileUploadTools.key(x))
        )
        return [...alreadyAddedFiltered, ...selectedFilesArray]
      })
    }
  }

  const addFile = (file: File) => {
    if (!files.some((x) => FileUploadTools.key(x) === FileUploadTools.key(file))) {
      setFiles((oldFiles) => [...oldFiles, file])
    }
  }

  const addFromDir = (dir: FileSystemDirectoryEntry) => {
    const reader = dir.createReader()
    reader.readEntries((entries) => {
      entries.forEach((entry) => {
        if (entry.isFile) {
          const fse = entry as FileSystemFileEntry
          fse.file((f) => addFile(f))
        } else if (entry.isDirectory) {
          addFromDir(entry as FileSystemDirectoryEntry)
        }
      })
    })
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    addFiles(event.target.files)
  }

  const handleDragEnter: DragEventHandler<HTMLDivElement> = () => {
    setBackgroundColor(theme.color.infoBoxColor)
  }

  const handleDragLeave: DragEventHandler<HTMLDivElement> = () => {
    setBackgroundColor(theme.color.primaryTextColor)
  }

  const handleDragOver: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    setBackgroundColor(theme.color.infoBoxColor)
  }

  const handleDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    setBackgroundColor(theme.color.primaryTextColor)
    const droppedItems = event.dataTransfer.items
    let ok = false
    if (droppedItems.length > 0) {
      Array.from(droppedItems).forEach((i) => {
        if (i.webkitGetAsEntry()?.isDirectory) {
          ok = true
          addFromDir(i.webkitGetAsEntry() as FileSystemDirectoryEntry)
        } else if (i.webkitGetAsEntry()?.isFile) {
          ok = true
          const fse = i.webkitGetAsEntry() as FileSystemFileEntry
          fse.file((f) => addFile(f))
        }
      })
    }
    const selectedFiles = event.dataTransfer.files
    if (!ok && selectedFiles && selectedFiles.length > 0) {
      addFiles(selectedFiles)
    }
  }

  const handleRemoveFile = (f: File) => {
    cancelUpload(f)
    setFiles((newFiles) =>
      newFiles.filter((x) => !FileUploadTools.get(x, fileUploaderState).removed)
    )
  }

  useEffect(() => {
    upload(files)
  }, [files, fileUploaderState, upload])

  const inputRef = React.useRef<HTMLInputElement>(null)

  return (
    <Card>
      <Card.Header>
        <Button variant="secondary" onClick={() => inputRef.current?.click()}>
          <Plus></Plus> {selectText}
        </Button>
      </Card.Header>
      <Card.Body style={{ backgroundColor: bgColor }}>
        <div
          className={styles.file_uploader}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}>
          <div>
            <input
              ref={inputRef}
              type="file"
              id="filePicker"
              onChange={handleChange}
              multiple
              hidden
            />
          </div>
          {files.filter((x) => !FileUploadTools.get(x, fileUploaderState).done).length > 0 ? (
            <div className={styles.files}>
              <div className={styles.group}>
                {files
                  .filter((x) => !FileUploadTools.get(x, fileUploaderState).done)
                  .map((file) => (
                    <div className={styles.file} key={FileUploadTools.key(file)}>
                      <div className={styles.cell}></div>
                      <div
                        className={
                          FileUploadTools.get(file, fileUploaderState).failed
                            ? styles.failed
                            : styles.cell
                        }>
                        {file.webkitRelativePath}
                        {file.name}
                      </div>
                      <div className={styles.cell}>
                        {FileUploadTools.get(file, fileUploaderState).fileSizeString}
                      </div>
                      <div className={styles.cell}>
                        <ProgressBar
                          className={styles.progress}
                          now={FileUploadTools.get(file, fileUploaderState).progress}
                        />
                      </div>
                      <div className={styles.cell}>
                        <Button
                          variant="secondary"
                          {...{ size: 'sm' }}
                          withSpacing
                          onClick={() => handleRemoveFile(file)}>
                          <X className={styles.icon} title={cancelTitle} />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className={styles.info}>{info}</div>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}
