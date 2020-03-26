import { ActionableModalOptions, ActionableModal } from '../../components/ui'
import { useEffect, useState, useCallback } from 'react'
import { useCMS } from 'tinacms'
import OpenAuthoringError from '../OpenAuthoringError'
import { useOpenAuthoring } from '../open-authoring/OpenAuthoringProvider'
import { getModalProps } from '../error-actions/github-interpeter'

interface Props {
  error: OpenAuthoringError
}

// When an open authoring error is caught, we don't immedietly know the cause
// We have to perform a few extra checks and render a modal with options
const OpenAuthoringErrorModal = (props: Props) => {
  const [errorModalProps, setErrorModalProps] = useState<
    ActionableModalOptions
  >(null)
  const { github } = useCMS().api

  const openAuthoring = useOpenAuthoring()

  // Hook to update root openAuthoring state when form fails.
  // We need to perform to check before an action is clicked (e.g start auth flow)
  // Because if it is perform on-the-fly, the window may be blocked.
  useEffect(() => {
    openAuthoring.updateAuthChecks()
  }, [])

  useEffect(() => {
    ;(async () => {
      if (props.error) {
        const modalProps = await getModalProps(
          props.error,
          github,
          openAuthoring.enterEditMode,
          openAuthoring.exitEditMode
        )
        setErrorModalProps(modalProps)
      } else {
        setErrorModalProps(null)
      }
    })()
  }, [props.error, openAuthoring.enterEditMode])

  return errorModalProps ? <ActionableModal {...errorModalProps} /> : <></>
}

export default OpenAuthoringErrorModal