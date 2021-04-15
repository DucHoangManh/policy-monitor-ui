import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import Box from '@material-ui/core/Box'
import { useContext } from 'react'
import { PolicyContext } from '../Context/policyContext'
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
  const [options, setOptions] = React.useState(['default'])
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [selectedIndex, setSelectedIndex] = React.useState(1)
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuItemClick = (event, index) => {
    setPolicyContext({
      ...policyContext,
      currentNamespace: options[index],
    })
    setSelectedIndex(index)
    setAnchorEl(null)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get(`/namespace`)
      setOptions(res.data)
    }
    fetchData()
    options.forEach((item, index) => {
      if (item === policyContext.currentNamespace) {
        setSelectedIndex(index)
        return
      }
      setSelectedIndex(1)
    })
  }, [])
  useEffect(() => {
    console.log(policyContext)
  }, [policyContext])

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
            Namespace
          </Box>
          <ListItemText
            secondaryTypographyProps={{ align: 'left' }}
            secondary={options[selectedIndex]}
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
        {options.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
