import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import Graph from '../components/chart';
import styles from '../styles/Home.module.css'
import Image from 'next/image';

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
  let url = `${apiUrl}/telco?history=true`;
  let data = await axios.post(url, { phoneNumber }).then(result => result.data).catch(err => {
    return err.response.data;
  });
  return data;
  } catch (error) {
    return error;
  }
};

const telcoImages: any = {
  MTN: 'mtn.png',
  GLO: 'glo.jpg',
  Airtel: 'airtel.png',
  '9mobile': '9mobile.png',
  NTEL: 'ntel.png',
  SMILE: 'smile.jpg',
};

let currentImage = '';

const Home: NextPage = () => {
  const [telcoOptions, setTelcoOptions] = useState([]);
  const [value, setValue] = useState("");
  const [validNumber, setValidNumber] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState([]);
  const onChangeText = async (e: any) => {
    setValue('')
    setValidNumber(false);
    const { value } = e.target;
    if (value && value.trim().length !== 0) {
      let data: any = await getTelcos(value);
      setTelcoOptions(data);
    }
  };
  const onInputValueSet = async (value: string) => {
    setValue('');
    setValidNumber(false);
    setHistory([]);
    if (value !== undefined) {
      await checkTelco(value).then((result: any) => {
        const { statusCode, data, message } = result;
        if (statusCode === 200) {
          if (data.telco !== null) {
            currentImage = `/telco-images/${telcoImages[data.telco]}`;
            setValue(data.telco);
            setValidNumber(true);
            setHistory(data.history)
          } else {
            setValue('Unrecognized phone number.');
            setValidNumber(false);
          }
        }
        if (statusCode === 400) {
          setValue(message[0]);
          setValidNumber(false);
        }
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
        <div style={{ width: '90%', maxWidth: '500px', marginTop: 5 }}>
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
          {validNumber && <Image src={currentImage} alt="Vercel Logo" width={72} height={72} />}
          {!validNumber && value}
        </h1>

        <div style={{ width: '90%', maxWidth: '500px', marginTop: 5 }}>
          {history.length > 0 && <Graph telcoHistory={history} />}
        </div>
      </main>
    </div>
  )
}

export default Home
