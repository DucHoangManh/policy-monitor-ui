import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import Box from '@material-ui/core/Box'
import Menu from '@material-ui/core/Menu'
import { useContext } from 'react'
import { PolicyContext } from '../Context/policyContext'
import { useHistory } from 'react-router-dom'
import API from '../Apis/policyRequest'
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  menu: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
}))

export default function SelectNamespace(props) {
  const classes = useStyles()
  const [policyContext, setPolicyContext] = useContext(PolicyContext)
  const [options, setOptions] = React.useState([])
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [displayVersion, setDisplayVersion] = React.useState('latest')
  const history = useHistory()
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuItemClick = (event, index) => {
    setPolicyContext({
      ...policyContext,
      currentVersion: options[index].id,
    })
    setSelectedIndex(index)
    setAnchorEl(null)
    history.push('/')
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  useEffect(() => {
    if (options[selectedIndex] != null) {
      if (options[selectedIndex].latest) {
        setDisplayVersion('latest')
        setPolicyContext({
          ...policyContext,
          allowUpdate: true,
        })
      } else {
        setDisplayVersion(options[selectedIndex].id.substring(4, 9))
        setPolicyContext({
          ...policyContext,
          allowUpdate: false,
        })
      }
    }
  }, [selectedIndex])
  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get(`/version`)
      setOptions(res.data)
      res.data.forEach((item, index) => {
        if (item.latest) {
          setSelectedIndex(index)
          return
        }
        setSelectedIndex(1)
      })
    }
    fetchData()
  }, [])

  return (
    <div>
      <List component='nav' aria-label='Device settings'>
        <ListItem
          button
          aria-haspopup='true'
          aria-controls='lock-menu'
          aria-label='Select a namespace'
          onClick={handleClickListItem}
          className={classes.menu}
        >
          <Box textAlign='right' style={{ paddingRight: 5 }}>
            Version
          </Box>
          <ListItemText
            secondaryTypographyProps={{ align: 'left' }}
            secondary={displayVersion}
          />
        </ListItem>
      </List>
      <Menu
        id='lock-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option, index) => {
          let op = ''
          if (option.latest) {
            op = 'latest'
          } else {
            op = option.id.substring(4, 9)
          }
          return (
            <MenuItem
              key={option.id}
              selected={index === selectedIndex}
              onClick={(event) => handleMenuItemClick(event, index)}
            >
              {op}
            </MenuItem>
          )
        })}
      </Menu>
    </div>
  )
}
