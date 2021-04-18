import ReactFlow, { Handle } from 'react-flow-renderer'
import AddIcon from '@material-ui/icons/AddCircleOutlineOutlined'
import CodeIcon from '@material-ui/icons/Code'
import DeleteIcon from '@material-ui/icons/HighlightOff'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import DialogTitle from '@material-ui/core/DialogTitle'
import { useState } from 'react'
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
  Input,
} from '@material-ui/core'
import { useEffect } from 'react'
const useStyles = makeStyles({
  root: {
    minWidth: 300,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 12,
  },
  bigTitle: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  textField: {
    width: 120,
    margin: 1,
    marginTop: 3,
    marginRight: 1,
  },
  resize: {
    fontSize: 12,
  },
})
export default ({ data }) => {
  const classes = useStyles()
  const policyDetail = data.policyDetail
  const setPolicyDetail = data.setPolicyDetail
  const [openDialog, setOpenDialog] = useState(false)
  const [selectorList, setSelectorList] = useState([])
  const [fieldContent, setFieldContent] = useState('')
  const handleAddClicked = (event) => {
    setOpenDialog(true)
  }
  const handleAdd = (event) => {
    const [key, value] = fieldContent.split(':', 2)
    setPolicyDetail((prevState) => ({
      ...prevState,
      spec: {
        ...prevState.spec,
        podSelector: {
          ...prevState.spec.podSelector,
          matchLabels: {
            ...prevState.spec.podSelector.matchLabels,
            [key]: value,
          },
        },
      },
    }))
    handleClose()
  }
  const handleClose = () => {
    setOpenDialog(false)
  }
  const handleDelete = (key) => {
    const { [key]: value, ...rest } = policyDetail.spec.podSelector.matchLabels
    setPolicyDetail((prevState) => ({
      ...prevState,
      spec: {
        ...prevState.spec,
        podSelector: {
          ...prevState.spec.podSelector,
          matchLabels: rest,
        },
      },
    }))
  }

  const handleChangeText = (event) => {
    setFieldContent(event.target.value)
  }
  // useEffect(() => {
  //   policyDetail.spec && console.log(policyDetail.spec.podSelector.matchLabels)
  // }, [policyDetail])
  const renderNodeSelectors = () => {
    return (
      policyDetail.spec.podSelector.matchLabels &&
      Object.keys(policyDetail.spec.podSelector.matchLabels).map((key) => (
        <Box
          px={2}
          key={key}
          display='flex'
          flexDirection='row'
          justifyContent='space-between'
        >
          <Typography className={classes.resize}>
            {`${key}:${policyDetail.spec.podSelector.matchLabels[key]}`}
          </Typography>

          <IconButton onClick={() => handleDelete(key)} edge='end' size='small'>
            <DeleteIcon className={classes.title} />
          </IconButton>
        </Box>
      ))
    )
  }

  return (
    <Paper style={{ minWidth: 150 }} variant='outlined'>
      <Handle type='target' position='left' style={{ background: '#555' }} />
      <Handle
        type='source'
        position='right'
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      <Box
        p={1}
        px={2}
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        alignItems='center'
      >
        <Box display='flex' justifyContent='start' alignItems='center'>
          <CodeIcon className={classes.bigTitle} />
          <Typography className={classes.title}>{'Pod Selector'}</Typography>
        </Box>
        <IconButton edge='end' size='small' onClick={handleAddClicked}>
          <AddIcon className={classes.title} />
        </IconButton>
      </Box>
      <Divider />
      {policyDetail.spec ? renderNodeSelectors() : 'loading'}

      <Dialog
        open={openDialog}
        onBackdropClick={handleClose}
        BackdropProps={{ style: { backgroundColor: 'transparent' } }}
        disableBackdropClick={false}
      >
        <DialogTitle id='alert-dialog-title'>Add Node Selector</DialogTitle>
        <DialogContent>
          <Box display='flex' flexDirection='row' justifyContent='center'>
            <TextField
              autoFocus
              placeholder='app:example'
              variant='outlined'
              size='small'
              margin='none'
              onChange={handleChangeText}
              InputProps={{
                classes: {
                  input: classes.resize,
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            className={classes.resize}
            onClick={handleAdd}
            color='primary'
          >
            add
          </Button>
          <Button
            className={classes.resize}
            onClick={handleClose}
            color='primary'
          >
            cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}
