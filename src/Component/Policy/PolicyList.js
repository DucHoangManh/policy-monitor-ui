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
  const [displayPolicies, setDisplayPolicices] = useState([])
  const [policyContext] = useContext(PolicyContext)
  const fetchData = async () => {
    const res = await API.get(`/${policyContext.currentNamespace}/policy/`, {
      params: {
        version: policyContext.currentVersion,
      },
    })
    setPolicies(res.data)
    setDisplayPolicices(res.data)
  }
  const handleDeleteClicked = (event, index) => {
    console.log(index)
  }
  const handleSearchChange = (event) => {
    const reg = new RegExp(event.target.value)
    setDisplayPolicices(
      policies.filter((item) => reg.test(item.networkPolicy.metadata.name))
    )
  }
  useEffect(() => {
    fetchData()
  }, [policyContext])
  useEffect(() => {
    fetchData()
  }, [])
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
