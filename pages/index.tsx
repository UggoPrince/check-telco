import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
// import Image from 'next/image'
import styles from '../styles/Home.module.css'

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getTelcos = async (text: string) => {
  try {
    let url =  `${apiUrl}/telco/auto-complete/${text}`;
    let { data } = await (await axios.get(url)).data;
    return data;
  } catch (error) {
    // console.error(error);
  }
};

const checkTelco = async (phoneNumber: string) => {
  try {
  let url = `${apiUrl}/telco`;
  let data = await axios.post(url, { phoneNumber }).then(result => result.data).catch(err => {
    return err.response.data;
  });
  console.log(data);
  return data;
  } catch (error) {
    return error;
  }
};

const Home: NextPage = () => {
  const [telcoOptions, setTelcoOptions] = useState([]);
  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState('');
  const onChangeText = async (e: any) => {
    setValue('')
    const { value } = e.target;
    if (value && value.trim().length !== 0) {
      let data: any = await getTelcos(value);
      setTelcoOptions(data);
    }
  };
  const onInputValueSet = async (value: string) => {
    setValue('')
    if (value !== undefined) {
      await checkTelco(value).then((result: any) => {
        const { statusCode, data, message } = result;
        if (statusCode === 200) setValue(data.telco);
        if (statusCode === 400) setValue(message[0]);
      });
    }
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Check Telco</title>
        <meta name="description" content="Check Telco Numbers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Check Telco
        </h1>
        <h4 style={{ marginTop: 40 }}>
          Tell service provider of a phone number.
        </h4>
        <div style={{ width: 500, marginTop: 5 }}>
        <Autocomplete
          freeSolo
          filterOptions={(x) => x}
          inputValue={inputValue}
          onChange={(e: any) => {
            e.defaultPrevented = true;
            const value = e.target.value || e.target.innerText;
            if (value !== '') onInputValueSet(value);
          }}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          options={telcoOptions ? telcoOptions.map((obj: any) => obj._id.phoneNumber) : []}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Type phone number"
              onChange={(e) => onChangeText(e)}
            />
          )}
        />
        </div>
        <h1>
          {value}
        </h1>
      </main>
    </div>
  )
}

export default Home
