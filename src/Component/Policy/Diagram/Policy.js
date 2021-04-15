import React from 'react'
import ReactFlow from 'react-flow-renderer'

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
    data: { label: <div>Default Node</div> },
    position: { x: 100, y: 125 },
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

export default () => (
  <div style={{ height: 400 }}>
    <ReactFlow elements={elements} />
  </div>
)
