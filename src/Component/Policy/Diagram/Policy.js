import React from 'react'
import ReactFlow from 'react-flow-renderer'
import PolicyMain from './PolicyMain'
import Ingress from './Ingress'
export default function Policy({ policyDetail, setPolicyDetail }) {
  const elements = [
    {
      id: '1',
      sourcePosition: 'right',
      targetPosition: 'left',
      data: { policyDetail: policyDetail, setPolicyDetail: setPolicyDetail },
      type: 'ingress',
      position: { x: 100, y: 25 },
    },
    {
      id: '2',
      // you can also pass a React component as a label
      sourcePosition: 'right',
      targetPosition: 'left',
      data: { policyDetail: policyDetail, setPolicyDetail: setPolicyDetail },
      type: 'main',
      position: { x: 400, y: 125 },
    },
    {
      id: '3',
      type: 'output',
      sourcePosition: 'right',
      targetPosition: 'left',
      data: { label: 'Output Node' },
      position: { x: 700, y: 25 },
      animated: true,
    },
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3', animated: true },
  ]
  const nodeTypes = {
    main: PolicyMain,
    ingress: Ingress,
  }

  return (
    <div style={{ height: 400 }}>
      <ReactFlow
        elements={elements}
        nodeTypes={nodeTypes}
        nodesDraggable={true}
      />
    </div>
  )
}
