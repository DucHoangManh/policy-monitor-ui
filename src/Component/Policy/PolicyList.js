import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import DeleteIcon from '@material-ui/icons/DeleteForeverOutlined'
import OpenIcon from '@material-ui/icons/OpenInNewOutlined'
import AddIcon from '@material-ui/icons/AddCircleOutlineOutlined'
import Paper from '@material-ui/core/Paper'
import { PolicyContext } from '../../Context/policyContext'
import API from '../../Apis/policyRequest'
import Title from './Title'
import { IconButton } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'flex-end',
  },
}))

const handleDeleteClicked = (event, index) => {
  console.log(index)
}
const handleOpenClicked = (event, index) => {
  console.log('Open clicked ' + index)
}

export default function PolicyList() {
  const classes = useStyles()
  const [policies, setPolicies] = useState([])
  const [policyContext] = useContext(PolicyContext)
  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get(`/${policyContext.currentNamespace}/policy/`, {
        params: {
          version: policyContext.currentVersion,
        },
      })
      setPolicies(res.data)
    }
    fetchData()
  }, [policyContext])
  const navigator = [
    {
      display: 'Network Policy',
      destination: '/policy',
    },
  ]
  return (
    <React.Fragment>
      <Title content={navigator} />
      <TableContainer component={Paper}>
        <Table size='medium'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Node Selector</TableCell>
              <TableCell colSpan={2} align='center'>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {policies.map((item, index) => (
              <TableRow hover key={item.id}>
                <TableCell>{item.networkPolicy.metadata.name}</TableCell>
                <TableCell>
                  {JSON.stringify(
                    item.networkPolicy.spec.podSelector.matchLabels
                  )}
                </TableCell>
                <TableCell padding='checkbox'>
                  {policyContext.allowUpdate && (
                    <IconButton
                      onClick={(event) => handleDeleteClicked(event, index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell align='right' padding='checkbox'>
                  <IconButton
                    onClick={(event) => handleOpenClicked(event, index)}
                    component={Link}
                    to={`/policy/${item.networkPolicy.metadata.name}`}
                  >
                    <OpenIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className={classes.seeMore}>
        <IconButton>
          Add
          <AddIcon />
        </IconButton>
      </div>
    </React.Fragment>
  )
}
