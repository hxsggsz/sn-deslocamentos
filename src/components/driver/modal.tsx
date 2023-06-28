import Box from '@mui/material/Box'
import { Button, TextField } from '@mui/material'
import Modal from '@mui/material/Modal'
import { IDeslocamentos } from '@/utils/types'
import Typography from '@mui/material/Typography'
import { Dispatch, SetStateAction, useState } from 'react'

interface IDriverModal {
  newDesloc: IDeslocamentos | undefined
  observation: string
  setObservation: Dispatch<SetStateAction<string>>
  handleFinsh: (setIsOpen: Dispatch<SetStateAction<boolean>>) => void
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderTop: '8px solid',
  borderColor: 'primary.main',
  borderRadius: '12px',
  p: 4,
}

export const DriverModal = (props: IDriverModal) => {
  const [open, setIsOpen] = useState(false)
  const handleModal = () => setIsOpen((prev) => !prev)

  return (
    <Modal
      open={!!props.newDesloc}
      onClose={handleModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {!open ? (
          <>
            <Typography id="modal-modal-title" variant="h4" component="h2">
              Nova corrida!
            </Typography>
            <Box mt={2} alignItems="end">
              <Button variant="contained" onClick={handleModal}>
                Ok
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography id="modal-modal-title" variant="h4" component="h2">
              Finalizar corrida?
            </Typography>
            <Box
              mt={2}
              sx={{ display: 'flex', justifyContent: 'end', gap: '8px' }}
            >
              <TextField
                value={props.observation}
                onChange={(ev) => props.setObservation(ev.target.value)}
                label="Observação da corrida:"
              />
              <Button
                variant="contained"
                onClick={() => props.handleFinsh(setIsOpen)}
              >
                finalizar
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  )
}
