import { useEffect, useContext, useState } from 'react'
import { Paper } from '@material-ui/core'
import Title from '../Policy/Title'
import { useParams } from 'react-router-dom'
import { PolicyContext } from '../../Context/policyContext'
import Policy from './Diagram/Policy'
import API from '../../Apis/policyRequest'
export default function PolicyDetail() {
  const { name: policyName } = useParams()
  const [policyContext] = useContext(PolicyContext)
  const [policyDetail, setPolicyDetail] = useState({})
  const navigator = [
    {
      display: 'Network Policy',
      destination: '/policy',
    },
    {
      display: policyName,
      destination: `/policy/${policyName}`,
    },
  ]
  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get(
        `/${policyContext.currentNamespace}/policy/by_name/${policyName}`,
        {
          params: {
            version: policyContext.currentVersion,
          },
        }
      )
      if (res.status === 200) {
        setPolicyDetail(res.data.networkPolicy)
      }
    }
    fetchData()
  }, [])
  return (
    <>
      <Title content={navigator} />
      <Paper>
        <Policy policyDetail={policyDetail} setPolicyDetail={setPolicyDetail} />
      </Paper>
    </>
  )
}
