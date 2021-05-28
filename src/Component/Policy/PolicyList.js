import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import { TableRow, Fab, Box } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/DeleteForeverOutlined'
import OpenIcon from '@material-ui/icons/OpenInNewOutlined'
import AddIcon from '@material-ui/icons/AddCircleOutlineOutlined'
import Paper from '@material-ui/core/Paper'
import { PolicyContext } from '../../Context/policyContext'
import API from '../../Apis/policyRequest'
import Title from './Title'
import { IconButton, TextField } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'flex-end',
  },
}))

export default function PolicyList() {
  const classes = useStyles()
  const [policies, setPolicies] = useState([])
  const [displayPolicies, setDisplayPolicies] = useState([])
  const [policyContext] = useContext(PolicyContext)
  const [open, setOpen] = useState(false)
  const [selectToDelete, setSelectToDelete] = useState('')
  const fetchData = async () => {
    const res = await API.get(`/${policyContext.currentNamespace}/policy/`, {
      params: {
        version: policyContext.currentVersion,
      },
    })
    setPolicies(res.data)
    setDisplayPolicies(res.data)
  }
  const handleDeleteClicked = (event, index) => {
    setSelectToDelete(displayPolicies[index].networkPolicy.metadata.name)
    setOpen(true)
  }
  const handleSearchChange = (event) => {
    const reg = new RegExp(event.target.value)
    setDisplayPolicies(
      policies.filter((item) => reg.test(item.networkPolicy.metadata.name))
    )
  }
  useEffect(() => {
    fetchData()
  }, [policyContext])
  useEffect(() => {
    fetchData()
  }, [])
  const handleClose = () => {
    setOpen(false)
  }
  const handleDelete = () => {
    if (selectToDelete === '') {
      handleClose()
      return
    }
    API.delete(
      `/${policyContext.currentNamespace}/policy/by_name/${selectToDelete}`,
      {
        params: {
          version: policyContext.currentVersion,
        },
      }
    ).then((res) => {
      if (res.status === 200) {
        setPolicies((prev) => {
          const newList = prev.filter((policy) => {
            return !(policy.networkPolicy.metadata.name === selectToDelete)
          })
          return newList
        })
        setDisplayPolicies((prev) => {
          const newList = prev.filter((policy) => {
            return !(policy.networkPolicy.metadata.name === selectToDelete)
          })
          return newList
        })
      }
    })
    setSelectToDelete('')

    handleClose()
  }
  const navigator = [
    {
      display: 'Network Policy',
      destination: '/policy',
    },
  ]
  return (
    <React.Fragment>
      <Title content={navigator} />
      <TableContainer component={Paper} style={{ maxHeight: 490 }}>
        <Table size='medium'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Node Selector</TableCell>
              <TableCell colSpan={2} align='center'>
                Action
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>
                <TextField
                  placeholder='search networkpolicy...'
                  variant='outlined'
                  size='small'
                  margin='none'
                  onChange={handleSearchChange}
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayPolicies.map((item, index) => {
              return (
                <TableRow hover key={item.id}>
                  <TableCell>{item.networkPolicy.metadata.name}</TableCell>
                  <TableCell>
                    {item.networkPolicy.spec.podSelector.matchLabels &&
                      JSON.stringify(
                        item.networkPolicy.spec.podSelector.matchLabels
                      )
                        .replace(/['"]+/g, '')
                        .replace(/[{}]+/g, '')}
                  </TableCell>
                  <TableCell padding='checkbox'>
                    <IconButton
                      onClick={(event) => handleDeleteClicked(event, index)}
                      disabled={!policyContext.allowUpdate}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align='right' padding='checkbox'>
                    <IconButton
                      component={Link}
                      to={`/policy/${item.networkPolicy.metadata.name}`}
                    >
                      <OpenIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
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
      <Box m={1} display='flex' flexDirection='row' justifyContent='flex-end'>
        <Fab
          variant='extended'
          size='small'
          aria-label='update'
          style={{ backgroundColor: '#81c784', margin: 1 }}
          disabled={!policyContext.allowUpdate}
          component={Link}
          to={`/new/policy`}
        >
          <AddIcon style={{ marginRight: 2 }} />
          ADD
        </Fab>
      </Box>
    </React.Fragment>
  )
}
