import React, { useState, useContext, useEffect } from 'react'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import Paper from '@material-ui/core/Paper'
import TableContainer from '@material-ui/core/TableContainer'
import { PolicyContext } from '../../Context/policyContext'
import API from '../../Apis/policyRequest'
import Title from '../../Component/Policy/Title'

export default function Orders() {
  const [versions, setVersions] = useState([])
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
      <TableContainer component={Paper} style={{ maxHeight: 440 }}>
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
