import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: '100%',
    overflow: 'hidden'
  },
  header: {
    display:'flex',
    overflow:'hidden',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: "center",
    textAlign:'center',
    fontFamily: 'fantasy',
    color: '#444',
    padding: '0.6em',
    backgroundColor: '#8dd3c7'
  },
  points: {
    display:'flex',
    overflow:'hidden',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: "center",
    textAlign:'center',
    fontFamily: 'fantasy',
    color: '#444',
    backgroundColor: 'white'
  },
  h2:{
    margin:'0 1px',
    fontSize:'1.1em',
    color:'#444'
  },
  h3:{
    margin:'0 1px',
    fontSize:'1.0em',
    color:'#444'
  },
  board:{
    display:'flex',
    overflow:'hidden',
    width:'100%',
    height: 'auto',
    flexDirection: 'column',
    // justifyContent: 'center', 
    alignItems: "center",
    textAlign:'center',
    padding: '0.2em',
    backgroundColor: '#ffffff'
  },
  refresh: {
    padding: '0 0 0 13px',
    cursor: 'pointer'
  }
}));

export default useStyles;