import mermaid from 'mermaid'
import { useEffect, useContext, useState } from 'react'
import { Box } from '@material-ui/core'
import API from '../Apis/policyRequest'
import { PolicyContext } from '../Context/policyContext'
const refactor = (obj) => {
  let tmp = JSON.stringify(obj)
  return tmp
    .replace(/{+/g, '')
    .replace(/}+/g, '')
    .replace(/:+/g, '=')
    .replace(/,+/g, '\\n')
    .replace(/['"]+/g, '')
}
export default function Visualizer() {
  const [policies, setPolicies] = useState([])
  const [policyContext] = useContext(PolicyContext)
  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get(`/${policyContext.currentNamespace}/policy/`, {
        params: {
          version: policyContext.currentVersion,
        },
      })
      setPolicies(
        await res.data.map((item) => {
          return item.networkPolicy
        })
      )

      // setChart((prevState) => {
      //   return `${prevState}
      //   ${policies.spec.}
      //   `
      // })
    }
    fetchData()
  }, [])
  useEffect(() => {
    const output = document.getElementById('output')
    mermaid.initialize({ startOnLoad: true })
    const def = `
    stateDiagram-v2
    Still-->Moving
    Moving-->Still

    Moving-->Crash
    `

    if (policies.length > 0) {
      let temp = 'stateDiagram-v2'
      policies.forEach((policy) => {
        const hasIngress = policy.spec.ingress ? true : false
        const hasEgress = policy.spec.egress ? true : false
        const hasPodSelector = policy.spec.podSelector.matchLabels
          ? true
          : false
        let ingresses = ''
        if (hasPodSelector && hasIngress) {
          policy.spec.ingress.forEach((item) => {
            ingresses += item.from[0].podSelector
              ? `${refactor(item.from[0].podSelector.matchLabels)}-->${refactor(
                  policy.spec.podSelector.matchLabels
                )}\n`
              : ''
          })
        }
        let egresses = ''
        if (hasPodSelector && hasEgress) {
          policy.spec.egress.forEach((item) => {
            egresses += item.to[0].podSelector
              ? `${refactor(policy.spec.podSelector.matchLabels)}-->${refactor(
                  item.to[0].podSelector.matchLabels
                )}\n`
              : ''
          })
        }

        temp += `\n${ingresses}\n${egresses}`
      })
      mermaid.render('visualizer', temp, (svgCode) => {
        output.innerHTML = svgCode
      })
    }
  }, [policies])
  return (
    <div style={{ maxHeight: 490 }}>
      <Box display='flex' flexDirection='row' justifyContent='center'>
        <div style={{ align: 'center' }} id='output' />
      </Box>
    </div>
  )
}
