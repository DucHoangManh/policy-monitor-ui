import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Typography from '@material-ui/core/Typography'
import { Link } from 'react-router-dom'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
export default function Title({ content }) {
  return (
    <Breadcrumbs
      aria-label='breadcrumb'
      separator={<NavigateNextIcon fontSize='small' />}
    >
      {content.map((item) => (
        <Typography
          key={item.display}
          style={{ textDecoration: 'none' }}
          component={Link}
          to={item.destination}
          color='textPrimary'
          variant='h6'
        >
          {item.display}
        </Typography>
      ))}
    </Breadcrumbs>
  )
}
