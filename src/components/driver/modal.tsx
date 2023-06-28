import { useState } from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import { Button } from '@mui/material'

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

export const DriverModal = () => {
  const [open, setOpen] = useState(true)
  const handleModal = () => setOpen((prev) => !prev)

  return (
    <Modal
      open={open}
      onClose={handleModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h4" component="h2">
          Nova corrida!
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Deseja aceitar?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'end', gap: '8px' }}>
          <Button onClick={handleModal}>Não</Button>
          <Button variant="contained" onClick={handleModal}>
            Sim
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
