import { Handle } from 'react-flow-renderer'
import AddIcon from '@material-ui/icons/AddCircleOutlineOutlined'
import DeleteIcon from '@material-ui/icons/HighlightOff'
import OpenInIcon from '@material-ui/icons/OpenInBrowser'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Radio from '@material-ui/core/Radio'
import DialogTitle from '@material-ui/core/DialogTitle'
import { useState } from 'react'
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
  Snackbar,
  Tooltip,
} from '@material-ui/core'
import Alert from '../../Alert'
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
    fontSize: 14,
    fontWeight: 700,
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
    fontWeight: 600,
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
  const [namespaceSelector, setNamespaceSelector] = useState('')
  const [podSelector, setPodSelector] = useState('')
  const [port, setPort] = useState('')
  const [errorBar, setErrorBar] = useState(false)
  const [errorBarContent, setErrorBarContent] = useState('')
  const handleAddClicked = (event) => {
    setNamespaceSelector('')
    setPodSelector('')
    setPort('')
    setOpenDialog(true)
  }
  const handleCloseErrorBar = () => {
    setErrorBar(false)
  }
  const handleAdd = (event) => {
    const portValidator = /^\d+$/
    const selectorValidator = /^\w+:\w+$/
    if (
      !selectorValidator.test(namespaceSelector) &&
      namespaceSelector !== ''
    ) {
      setErrorBarContent('Namespace Selector is Invalid')
      setErrorBar(true)
    } else if (!selectorValidator.test(podSelector)) {
      setErrorBarContent('Pod Selector is Invalid')
      setErrorBar(true)
    } else if (!portValidator.test(port) && port !== '') {
      setErrorBarContent('Port is Invalid')
      setErrorBar(true)
    } else {
      const [nsKey, nsValue] = namespaceSelector.split(':', 2)
      const [podKey, podValue] = podSelector.split(':', 2)
      setPolicyDetail((prevState) => ({
        ...prevState,
        spec: {
          ...prevState.spec,
          ingress: [
            ...(prevState.spec.ingress ? [...prevState.spec.ingress] : []),
            {
              from: [
                {
                  ...(namespaceSelector && {
                    namespaceSelector: {
                      matchLabels: {
                        [nsKey]: nsValue,
                      },
                    },
                  }),
                  podSelector: {
                    matchLabels: {
                      [podKey]: podValue,
                    },
                  },
                },
              ],
              ...(port && {
                ports: [
                  {
                    port: parseInt(port),
                  },
                ],
              }),
            },
          ],
        },
      }))
      handleClose()
    }
  }
  const handleClose = () => {
    setOpenDialog(false)
  }
  const handleDelete = (index) => {
    setPolicyDetail((prevState) => {
      prevState.spec.ingress.splice(index, 1)
      return {
        ...prevState,
        spec: {
          ...prevState.spec,
          ingress: prevState.spec.ingress,
        },
      }
    })
  }

  const handleNamespaceSelectorChange = (event) => {
    setNamespaceSelector(event.target.value)
  }
  const handlePodSelectorChange = (event) => {
    setPodSelector(event.target.value)
  }
  const handlePortChange = (event) => {
    setPort(event.target.value)
  }
  const renderNamespace = (ingressItem) => {
    return (
      ingressItem.from[0].namespaceSelector && (
        <>
          <Tooltip
            arrow
            title='Only pods in matched namespace are affected by this Network Policy'
          >
            <Typography className={classes.resizeTitle}>
              {'Namespace Selector'}
            </Typography>
          </Tooltip>
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
          <Tooltip arrow title='Allow Ingress access from matched pods'>
            <Typography className={classes.resizeTitle}>
              {'Pod Selector'}
            </Typography>
          </Tooltip>
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
    return (
      ingressItem.ports && (
        <>
          <Tooltip arrow title='Allow Ingress access from port'>
            <Typography className={classes.resizeTitle}>
              {'Port Allowed'}
            </Typography>
          </Tooltip>
          <Divider light={true} variant='middle' />
          <Box>
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

              <Tooltip title='Delete this Ingress rule' arrow>
                <IconButton
                  onClick={() => handleDelete(index)}
                  edge='end'
                  size='small'
                >
                  <DeleteIcon
                    style={{ fill: '#f44336' }}
                    className={classes.title}
                  />
                </IconButton>
              </Tooltip>
            </Box>
            <Box my={1} />
            <Divider />
          </Box>
        )
      })
    )
  }

  return (
    <Paper style={{ minWidth: 150 }} elevation={3}>
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
        <Tooltip
          arrow
          title='This section tells which Pods can access the main Pods from which Namespace, by which ports'
        >
          <Box display='flex' justifyContent='start' alignItems='center'>
            <OpenInIcon />
            <Typography className={classes.title}>{'Ingress'}</Typography>
          </Box>
        </Tooltip>
        <Tooltip arrow title='Add Ingress rule'>
          <IconButton edge='end' size='small' onClick={handleAddClicked}>
            <AddIcon style={{ fill: '#4caf50' }} className={classes.title} />
          </IconButton>
        </Tooltip>
      </Box>
      <Divider />
      {policyDetail.spec ? renderIngress() : 'loading'}

      <Dialog
        open={openDialog}
        onBackdropClick={handleClose}
        BackdropProps={{ style: { backgroundColor: 'transparent' } }}
        disableBackdropClick={false}
      >
        <DialogTitle id='add-dialog-title'>Add Ingress</DialogTitle>
        <DialogContent>
          <Typography className={classes.resizeTitle}>
            {'Namespace Selector'}
          </Typography>
          <Tooltip arrow title='If leave blank, default to current Namespace'>
            <TextField
              autoFocus
              placeholder='team:analysis'
              variant='outlined'
              size='small'
              margin='none'
              onChange={handleNamespaceSelectorChange}
              InputProps={{
                classes: {
                  input: classes.resize,
                },
              }}
            />
          </Tooltip>
          <Typography className={classes.resizeTitle}>
            {'Pod Selector'}
          </Typography>
          <Tooltip
            arrow
            title='Allow access from matched Pods, must be specific'
          >
            <TextField
              placeholder='app:ui'
              variant='outlined'
              size='small'
              margin='none'
              onChange={handlePodSelectorChange}
              InputProps={{
                classes: {
                  input: classes.resize,
                },
              }}
            />
          </Tooltip>
          <Typography className={classes.resizeTitle}>{'Port'}</Typography>

          <Tooltip
            arrow
            title='Can be leave blank to allow access from all ports'
          >
            <TextField
              placeholder='443'
              variant='outlined'
              size='small'
              margin='none'
              onChange={handlePortChange}
              InputProps={{
                classes: {
                  input: classes.resize,
                },
              }}
            />
          </Tooltip>
          <Snackbar
            open={errorBar}
            autoHideDuration={3000}
            onClose={handleCloseErrorBar}
          >
            <Alert onClose={handleCloseErrorBar} severity='error'>
              {errorBarContent}
            </Alert>
          </Snackbar>
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
