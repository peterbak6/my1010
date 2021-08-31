import './App.css';
import {Box, Button} from '@material-ui/core'
import React, { useEffect } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';

import useStyles from './style';
import Board from './widgets/Board'
import { useState , useCallback} from 'react';
import {Refresh} from './widgets/utils';

function App() {
  const classes = useStyles();
  const [user, setUser] = useState('')
  const [userOptions, setUserOptions]  = useState(Object.keys(JSON.parse(localStorage.getItem("my1010") || "{}")))
  const [points, setPoints] = useState(0);
  const [maxPoints, setMaxPoints] = useState(0)
  
  useEffect(()=>{
    if (!user){ return; }
    let my1010UserPoints = JSON.parse(localStorage.getItem("my1010") || "{}"); 
    if (my1010UserPoints[user]===undefined){
      my1010UserPoints[user] = 0
    }
    my1010UserPoints[user] = Math.max(maxPoints, points);
    setMaxPoints(my1010UserPoints[user]);
    localStorage.setItem("my1010",JSON.stringify(my1010UserPoints));
  }, [points]);

  useEffect(()=>{
    if (!user){ return; }
    let my1010UserPoints = JSON.parse(localStorage.getItem("my1010") || "{}"); 
    if (my1010UserPoints[user]===undefined){
      my1010UserPoints[user] = 0
    }
    setPoints(0)
    setMaxPoints(my1010UserPoints[user])
    setUserOptions(Object.keys(my1010UserPoints))
  }, [user]);

  const handleChange = useCallback((key, value) => {
    if (key==='points' || key==="fullrow"){
      setPoints(p => +p+value);
    }
  },[]);

  const onHandleRefresh = () => {
    setPoints(0)
  }

  const config = {
    size: 37,
    grid: 10,
    padding: 2,
    stones: 3,
    colors: ["#4baf90",
      "#a664c4",
      "#73b34a",
      "#c95682",
      "#787c37",
      "#6587cd",
      "#ce9b44",
      "#c95b41"]
  }

  return (
    <Box className={classes.root}>
      <header className={classes.header}>
        <h2 className={classes.h2}>
          My 1010
        </h2>
        <Autocomplete
          value={user}
          onChange={(event, newValue) => {
            if (newValue && newValue.inputValue) {
              // Create a new value from the user input
              setUser(newValue.inputValue);
            } else {
              setUser(newValue);
            }
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          options={userOptions}
          getOptionLabel={(option) => {
            if (option.inputValue) {
              return option.inputValue;
            }
            return option;
          }}
          renderOption={(option) => option}
          style={{ width: 120 }}
          freeSolo
          renderInput={(params) => (
            <TextField {...params} placeholder='user'/>
          )}
        />
      </header>
      <Box className={classes.points}>
        <h3 className={classes.h3}>{points}</h3>
        <Box className={classes.refresh}>
          <Button onClick={onHandleRefresh}><Refresh/></Button>
        </Box>
        <h3 className={classes.h3}>({maxPoints})</h3>
      </Box>
      <Board config={config} points={points} handleChange={handleChange}/>
    </Box>
  );
}

export default App;
