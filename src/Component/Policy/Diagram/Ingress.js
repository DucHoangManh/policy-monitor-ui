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
  resizeTitle: {
    fontSize: 13,
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
  const renderNamespace = (ingressItem) => {
    return (
      ingressItem.from[0].namespaceSelector && (
        <>
          <Typography className={classes.resizeTitle}>
            {'Namespace Selector'}
          </Typography>

          <Divider light={true} variant='middle' />
          {Object.keys(ingressItem.from[0].namespaceSelector.matchLabels).map(
            (key) => {
              return (
                <Typography
                  key={key}
                  className={classes.resize}
                >{`${key}:${ingressItem.from[0].namespaceSelector.matchLabels[key]}`}</Typography>
              )
            }
          )}
        </>
      )
    )
  }
  const renderPod = (ingressItem) => {
    return (
      ingressItem.from[0].podSelector && (
        <>
          <Typography className={classes.resizeTitle}>
            {'Pod Selector'}
          </Typography>

          <Divider light={true} variant='middle' />
          {Object.keys(ingressItem.from[0].podSelector.matchLabels).map(
            (key) => {
              return (
                <Typography
                  key={key}
                  className={classes.resize}
                >{`${key}:${ingressItem.from[0].podSelector.matchLabels[key]}`}</Typography>
              )
            }
          )}
        </>
      )
    )
  }
  const renderPort = (ingressItem) => {
    console.log(ingressItem.ports)
    return (
      ingressItem.ports && (
        <>
          <Typography className={classes.resizeTitle}>
            {'Port Allowed'}
          </Typography>

          <Divider light={true} variant='middle' />
          <Box display='flex' flexDirection='row'>
            {ingressItem.ports.map((item) => {
              return (
                <Typography
                  className={classes.resize}
                  key={item.port}
                >{`:${item.port}`}</Typography>
              )
            })}
          </Box>
        </>
      )
    )
  }
  const renderIngress = () => {
    //console.log(policyDetail)
    return (
      policyDetail.spec.ingress &&
      policyDetail.spec.ingress.map((ingressItem, index) => {
        return (
          <Box key={index}>
            <Box
              px={2}
              display='flex'
              flexDirection='row'
              justifyContent='space-between'
            >
              <Box>
                {renderNamespace(ingressItem)}
                <Box my={1} />
                {renderPod(ingressItem)}
                <Box my={1} />
                {renderPort(ingressItem)}
              </Box>
              <IconButton
                onClick={() => handleDelete(index)}
                edge='end'
                size='small'
              >
                <DeleteIcon className={classes.title} />
              </IconButton>
            </Box>
            <Box my={1} />
            <Divider />
          </Box>
        )
      })
    )
  }

  return (
    <Paper style={{ minWidth: 150 }} variant='outlined'>
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
          <Typography className={classes.bigTitle}>{'Ingress'}</Typography>
        </Box>
        <IconButton edge='end' size='small' onClick={handleAddClicked}>
          <AddIcon className={classes.title} />
        </IconButton>
      </Box>
      <Divider />
      {policyDetail.spec ? renderIngress() : 'loading'}

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
