import React, { useContext, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ReactFlow from 'react-flow-renderer'
import { useHistory } from 'react-router-dom'
import PolicyMain from './PolicyMain'
import Ingress from './Ingress'
import Engress from './Engress'
import FileCopyIcon from '@material-ui/icons/FileCopy'

import DeleteIcon from '@material-ui/icons/Delete'
import UpdateIcon from '@material-ui/icons/Update'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Fab, Box, Paper, Button, Snackbar } from '@material-ui/core'
import { PolicyContext } from '../../../Context/policyContext'
import API from '../../../Apis/policyRequest'
import Alert from '../../Alert'
const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}))
export default function Policy({ policyDetail, setPolicyDetail }) {
  const elements = [
    {
      id: '1',
      sourcePosition: 'right',
      targetPosition: 'left',
      data: { policyDetail: policyDetail, setPolicyDetail: setPolicyDetail },
      type: 'ingress',
      position: { x: 100, y: 25 },
    },
    {
      id: '2',
      sourcePosition: 'right',
      targetPosition: 'left',
      data: { policyDetail: policyDetail, setPolicyDetail: setPolicyDetail },
      type: 'main',
      position: { x: 400, y: 125 },
    },
    {
      id: '3',
      type: 'engress',
      sourcePosition: 'right',
      targetPosition: 'left',
      data: { policyDetail: policyDetail, setPolicyDetail: setPolicyDetail },
      position: { x: 700, y: 25 },
      animated: true,
    },
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3', animated: true },
  ]
  const nodeTypes = {
    main: PolicyMain,
    ingress: Ingress,
    engress: Engress,
  }
  const classes = useStyles()
  const [policyContext] = useContext(PolicyContext)
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState(false)
  const [toastContent, setToastContent] = useState('')
  const history = useHistory()
  const handleClose = () => {
    setOpen(false)
  }
  const handleCloseToast = () => {
    setToast(false)
  }
  const handleDelete = () => {
    API.delete(
      `/${policyContext.currentNamespace}/policy/by_name/${policyDetail.metadata.name}`,
      {
        params: {
          version: policyContext.currentVersion,
        },
      }
    ).then((res) => {
      if (res.status === 200) {
        setToastContent('Network Policy deleted')
        setToast(true)
        setTimeout(() => {
          history.push('/policy')
        }, 1000)
      }
    })

    handleClose()
  }
  const handleUpdateClicked = () => {
    API.patch(`/${policyContext.currentNamespace}/policy/`, {
      ...policyDetail,
    }).then((res) => {
      if (res.status === 200) {
        setToastContent('Network Policy updated')
        setToast(true)
      }
    })
  }

  return (
    <Paper>
      <div style={{ height: 410 }}>
        <ReactFlow
          elements={elements}
          nodeTypes={nodeTypes}
          nodesDraggable={true}
        />

        <Box display='flex' flexDirection='row' justifyContent='flex-end'>
          <Fab
            variant='extended'
            size='small'
            aria-label='update'
            className={classes.margin}
            style={{ backgroundColor: '#757de8' }}
          >
            <FileCopyIcon className={classes.extendedIcon} />
            COPY
          </Fab>
          <Fab
            variant='extended'
            size='small'
            aria-label='update'
            className={classes.margin}
            style={{ backgroundColor: '#ffb74d' }}
            disabled={!policyContext.allowUpdate}
            onClick={handleUpdateClicked}
          >
            <UpdateIcon className={classes.extendedIcon} />
            UPDATE
          </Fab>
          <Fab
            variant='extended'
            size='small'
            aria-label='update'
            className={classes.margin}
            style={{ backgroundColor: '#f44336' }}
            disabled={!policyContext.allowUpdate}
            onClick={() => {
              setOpen(true)
            }}
          >
            <DeleteIcon className={classes.extendedIcon} />
            DELETE
          </Fab>
        </Box>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle>{'Confirm Delete'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure want to delete this Network Policy?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} color='primary'>
            Delete
          </Button>
          <Button onClick={handleClose} color='primary' autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={toast} autoHideDuration={3000} onClose={handleCloseToast}>
        <Alert onClose={handleCloseToast} severity='success'>
          {toastContent}
        </Alert>
      </Snackbar>
    </Paper>
  )
}
