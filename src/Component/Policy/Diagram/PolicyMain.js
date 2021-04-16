import ReactFlow, { Handle } from 'react-flow-renderer'
import AddIcon from '@material-ui/icons/AddCircleOutlineOutlined'
import CodeIcon from '@material-ui/icons/Code'
import DeleteIcon from '@material-ui/icons/HighlightOff'
import { makeStyles } from '@material-ui/core/styles'
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
  const handleAddClicked = (event) => {
    alert('add clicked')
  }
  const renderNodeSelectors = () => {
    return Object.keys(policyDetail.spec.podSelector.matchLabels).map((key) => (
      <Box display='flex' flexDirection='row' justifyContent='center'>
        <TextField
          variant='outlined'
          defaultValue={`${key}:${policyDetail.spec.podSelector.matchLabels[key]}`}
          size='small'
          margin='none'
          InputProps={{
            classes: {
              input: classes.resize,
            },
          }}
          className={classes.textField}
        />
        <IconButton edge='end' size='small'>
          <DeleteIcon className={classes.title} />
        </IconButton>
      </Box>
    ))
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
          <Typography className={classes.title}>{'Node Selector'}</Typography>
        </Box>
        <IconButton edge='end' size='small' onClick={handleAddClicked}>
          <AddIcon className={classes.title} />
        </IconButton>
      </Box>
      <Divider />
      {policyDetail.spec ? renderNodeSelectors() : 'loading'}
    </Paper>
  )
}
