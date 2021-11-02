import React, { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import axiosConn from 'global/axiosConn';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function DropdownComp() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [option, setOption] = useState([]);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');

  const [makeData, setMakeData] = useState([]);
  const [modelData, setModelData] = useState([{Model: 'Please Select Make'}]);
  const [value, setValue] = useState('');

  useEffect(() => {
    const url = '/api/makes';

    axiosConn.get(url)
    .then(function (innerResponse) {
        setMakeData(innerResponse.data.data);
        console.log(innerResponse);
                    
    }).catch(function (innerResponse) {
          console.log(innerResponse);
    })

  }, []);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setModel(value);
  };
  
  const escapeRegexCharacters = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  const getSuggestions = val => {
    const escapedValue = escapeRegexCharacters(val.trim());
    
    if (escapedValue === '') {
      return [];
    }
  
    const regex = new RegExp('^' + escapedValue, 'i');
  
    return makeData.filter(makeData => makeData.Make);
  }
  

  const onSelectVehicleMakeOption = (option, newValue) => {    
    setIsLoading(true);
    if(newValue != null) {
      const url = `/api/models/${newValue.MakeId}`
      axiosConn.get(url)
      .then(function (results) {
          setModelData(results.data.data);
          console.log(results);
          setTimeout(() => {
            setIsLoading(false);  
          }, 1000);
          
      }).catch(function (innerResponse) {
          console.log(innerResponse);
      })
      setMake(newValue.Make);    
  
    } else {
      setMake([]);    
    }
  }

  return (
    <Container maxWidth="md" style={{marginTop: '35px'}}>      
      <FormControl sx={{ m: 1 }} variant="standard">
        
        <Autocomplete       
          disableClearable    
          options={makeData}
          onChange={(event, newValue) => onSelectVehicleMakeOption(option, newValue)}
          getOptionLabel={(option) => option.Make}
          defaultValue={getSuggestions(value)[0]} 
          sx={{ width: 300 }}
          renderInput= {(params) => {            
            return (
              <TextField
                {...params}    
                label="Vehicle Make"            
                variant="outlined"
                
                style={{lineHeight: '28px'}}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter cities"
                autoComplete="off"
                size={'small'}
                InputProps={{
                  ...params.InputProps,       

                }}
              />
            );
          }}
        />
      </FormControl>

      <FormControl sx={{ m: 1, width: 300 }} size={'small'}>
        <InputLabel id="demo-multiple-name-label">Vehicle Model</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"          
          value={model}
          onChange={handleChange}
          input={<OutlinedInput label="Vehicle Model" />}
          startAdornment={
            <InputAdornment position="start">
              {isLoading === true?
              <CircularProgress size={15}/>
              :
              ''
              }
            </InputAdornment>
          }
          // {loading && (
          //   <CircularProgress size={68} className={classes.fabProgress} />
          // )}
          MenuProps={MenuProps}
        >          
          {modelData.map((name) => (
            <MenuItem
              key={name.Model}
              value={name.Model}              
            >
              {name.Model}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
               
   </Container>
  );
}