import React, { useContext } from 'react'
import { Grid,Typography,Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { SocketContext } from '../SocketContext'

const useStyles = makeStyles((theme) => ({
  video: {
    width: '550px',
    [theme.breakpoints.down('xs')]: {
      width: '300px',
    },
  },
  gridContainer: {
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  paper: {
    padding: '10px',
    border: '2px solid black',
    margin: '10px',
  },
}));

const VideoPlayer = () => {
  const context=useContext(SocketContext)
  const {call,name,callAccepted ,myvideo,userVideo,callEnded,stream}=context!
  

  const classes =useStyles();
  console.log(stream)

  return (
    <Grid   container className={classes.gridContainer} >
      {/* Our owen vido */}
      { <Paper className={classes.paper}>
        <Grid item xs={12} md={6}>
          <Typography variant='h5' gutterBottom  >{name ||"Name"}</Typography>
          <video playsInline muted ref={myvideo} autoPlay className={classes.video} />
        </Grid>
      </Paper> }
    
     {/* Other person video */}

     {callAccepted && !callEnded && <Paper className={classes.paper}>
        <Grid item xs={12} md={6}>
          <Typography variant='h5' gutterBottom  >{call.name ||"Name"}</Typography>
          <video playsInline  ref={userVideo}  autoPlay className={classes.video} />
        </Grid>
      </Paper> }
    
    </Grid>
  )
}

export default VideoPlayer