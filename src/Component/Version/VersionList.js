import React, { useState, useContext, useEffect } from 'react'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import DeleteIcon from '@material-ui/icons/DeleteForeverOutlined'
import OpenIcon from '@material-ui/icons/OpenInNewOutlined'
import AddIcon from '@material-ui/icons/AddCircleOutlineOutlined'
import Paper from '@material-ui/core/Paper'
import TableContainer from '@material-ui/core/TableContainer'
import { PolicyContext } from '../../Context/policyContext'
import API from '../../Apis/policyRequest'
import Title from '../../Component/Policy/Title'
import { IconButton } from '@material-ui/core'

function preventDefault(event) {
  event.preventDefault()
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'flex-end',
  },
  table: {
    minWidth: 650,
  },
}))

export default function Orders() {
  const classes = useStyles()
  const [versions, setVersions] = useState([])
  const [policyContext] = useContext(PolicyContext)
  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get(`/version`)
      setVersions(res.data)
    }
    fetchData()
  }, [])
  const navigator = [
    {
      display: 'Version',
      destination: '/version',
    },
  ]
  return (
    <React.Fragment>
      <Title content={navigator}>&gt; Policy Version</Title>
      <TableContainer component={Paper}>
        <Table size='medium'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Content</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {versions.map((item, index) => (
              <TableRow hover key={item.id}>
                <TableCell>
                  {item.id + (item.latest ? '(latest)' : '')}
                </TableCell>
                <TableCell>{item.content}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  )
}
