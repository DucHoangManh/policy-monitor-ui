import React, { useEffect } from 'react'
import ReactFlow from 'react-flow-renderer'
import PolicyMain from './PolicyMain'

export default ({ detail }) => {
  const elements = [
    {
      id: '1',
      type: 'input', // input node
      sourcePosition: 'right',
      targetPosition: 'left',
      data: { label: 'Input Node' },
      position: { x: 200, y: 25 },
    },
    // default node
    {
      id: '2',
      // you can also pass a React component as a label
      sourcePosition: 'right',
      targetPosition: 'left',
      data: detail,
      type: 'special',
      position: { x: 500, y: 125 },
    },
    {
      id: '3',
      type: 'output', // output node
      sourcePosition: 'right',
      targetPosition: 'left',
      data: { label: 'Output Node' },
      position: { x: 725, y: 250 },
      animated: true,
    },
    // animated edge
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3', animated: true },
  ]
  const nodeTypes = {
    special: PolicyMain,
  }

  return (
    <div style={{ height: 400 }}>
      <ReactFlow elements={elements} nodeTypes={nodeTypes} />
    </div>
  )
}
