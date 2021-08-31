import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: '100%',
    overflow: 'hidden'
  },
  header: {
    display:'flex',
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
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: "center",
    textAlign:'center',
    fontFamily: 'fantasy',
    color: '#444',
    backgroundColor: ''
  },
  h2:{
    margin:'0 1px',
    fontSize:'1.7em',
    color:'#444'
  },
  board:{
    display:'flex',
    width:'100%',
    height: '100vh',
    flexDirection: 'column',
    // justifyContent: 'center', 
    alignItems: "center",
    textAlign:'center',
    padding: '0.2em',
    backgroundColor: '#f2f2f2'
  },
  refresh: {
    padding: '0 0 0 13px',
    cursor: 'pointer'
  }
}));

export default useStyles;