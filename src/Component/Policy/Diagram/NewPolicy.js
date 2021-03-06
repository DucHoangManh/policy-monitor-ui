import { useContext, useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ReactFlow from 'react-flow-renderer'
import PolicyMain from './PolicyMain'
import Ingress from './Ingress'
import Engress from './Engress'
import AddIcon from '@material-ui/icons/AddCircleOutlineOutlined'
import EditIcon from '@material-ui/icons/Edit'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { useHistory } from 'react-router-dom'
import {
  Fab,
  Box,
  Paper,
  Button,
  Snackbar,
  Typography,
  IconButton,
  TextField,
} from '@material-ui/core'
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
  resize: {
    fontSize: 13,
  },
}))
//TODO:verify policy before create
//TODO:policy name must be lower case without space
export default function NewPolicy() {
  const initState = {
    apiVersion: 'networking.k8s.io/v1',
    kind: 'NetworkPolicy',
    metadata: {
      name: 'new-policy',
    },
    spec: {
      podSelector: {
        matchLabels: {},
      },
    },
  }
  const [policyDetail, setPolicyDetail] = useState(initState)
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
    { id: 'r1-2', source: '1', target: '2', animated: true },
    { id: 'r2-3', source: '2', target: '3', animated: true },
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
  const [policyName, setPolicyName] = useState('policy-name')
  const history = useHistory()
  const handlePolicyNameChange = (event) => {
    setPolicyName(
      `${policyContext.currentNamespace}.${event.target.value
        .toLowerCase()
        .replace(/ +/g, '-')}`
    )
  }
  const hanleConfirmPolicyNameChange = () => {
    if (policyName === '') {
      alert(`Policy name can't be blank`)
      return
    }
    setPolicyDetail((prevState) => {
      return {
        ...prevState,
        metadata: {
          ...prevState.metadata,
          name: policyName,
        },
      }
    })
    handleClose()
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleCloseToast = () => {
    setToast(false)
  }
  useEffect(() => {
    setPolicyDetail((prevState) => {
      const verify = () => {
        if (policyDetail.spec.ingress && !policyDetail.spec.egress) {
          return ['Ingress']
        } else if (!policyDetail.spec.ingress && policyDetail.spec.egress) {
          return ['Egress']
        } else {
          return ['Ingress', 'Egress']
        }
      }
      return {
        ...prevState,
        spec: {
          ...prevState.spec,
          policyType: [...verify()],
        },
      }
    })
  }, [policyDetail.spec.ingress, policyDetail.spec.egress])
  const handleCreateClicked = () => {
    API.post(`/${policyContext.currentNamespace}/policy/`, {
      ...policyDetail,
    }).then((res) => {
      if (res.status === 200) {
        setToastContent('New Network Policy created')
        setToast(true)
        setTimeout(() => {
          history.push('/')
        }, 2000)
      }
    })
  }

  return (
    <div style={{ height: 490 }}>
      <Box display='flex' flexDirection='row' alignItems='center'>
        <Typography variant='h6'>{policyDetail.metadata.name}</Typography>
        <IconButton
          onClick={() => {
            setOpen(true)
          }}
        >
          <EditIcon />
        </IconButton>
      </Box>
      <Paper>
        <div style={{ height: 400 }}>
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
              style={{ backgroundColor: '#81c784' }}
              disabled={!policyContext.allowUpdate}
              onClick={handleCreateClicked}
            >
              <AddIcon className={classes.extendedIcon} />
              CREATE
            </Fab>
          </Box>
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          BackdropProps={{ style: { backgroundColor: 'transparent' } }}
        >
          <DialogTitle>{'Change Network Policy Name'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              placeholder='Policy Name'
              variant='outlined'
              size='medium'
              margin='none'
              onChange={handlePolicyNameChange}
              InputProps={{
                classes: {
                  input: classes.resize,
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={hanleConfirmPolicyNameChange} color='primary'>
              Ok
            </Button>
            <Button onClick={handleClose} color='primary' autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={toast}
          autoHideDuration={3000}
          onClose={handleCloseToast}
        >
          <Alert onClose={handleCloseToast} severity='success'>
            {toastContent}
          </Alert>
        </Snackbar>
      </Paper>
    </div>
  )
}
