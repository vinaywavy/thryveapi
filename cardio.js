import axios from 'axios'
import qs from 'qs'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import * as dotenv from 'dotenv'
dotenv.config()
import cron from 'node-cron'

let tDate = new Date()
let tDay = tDate.toISOString().substring(0,10)
let utcTime = 'T00:00:00+01:00'
let today = tDay.concat(utcTime)
let tomDate = new Date(tDate.getTime() + ( 24 * 60 * 60 * 1000)).toISOString().substring(0,10)
let tomorrow = tomDate.concat(utcTime)

const authData = qs.stringify({
    'authenticationToken': process.env.AUTHENTICATION_TOKEN,
    'startTimestamp': `${today}`,
    'endTimestamp': `${tomorrow}`,
    'dataSources': '2',
    'valueTypes': '3000',
    'detailed': 'false' 
  });

const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.und-gesund.de/v5/dynamicEpochValues',
    headers: { 
      'AppAuthorization': process.env.APP_AUTHORIZATION, 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'Authorization': process.env.AUTHORIZATION
    },
    data : authData
  };

  let heartRate = []

  const firebaseApp = initializeApp({
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
})

const firestore = getFirestore()

const date = new Date().toISOString()

const specialOfTheDay = doc(firestore, `Cardio/${date}`)


  async function getEpochVal() {
      await axios(config)
        .then(function(response) {
            let thryveData = response.data
            let destructredData = thryveData[0].dataSources[0].data
            //console.log(destructredData)
            heartRate = [...destructredData]
            console.log(`Length of the Array is ${heartRate.length}`)
            setTimeout(() => {
              writeDailySpecial()
              //console.log(`Data has been updated on ${Date().toISOString()} in the db`)
            }, 50000);
        })
        .catch(function(error){
            console.log(error)
        })
        .finally(() => {
          tDate = new Date()
          tDay = tDate.toISOString().substring(0,10)
          utcTime = 'T00:00:00+01:00'
          today = tDay.concat(utcTime)
          tomDate = new Date(tDate.getTime() + ( 48 * 60 * 60 * 1000)).toISOString().substring(0,10)
          tomorrow = tomDate.concat(utcTime)
          console.log(`Value for tDate is : ${tDate}; Today val is ${today} ; tom val is: ${tomorrow}`)
        })
  }

  //getEpochVal()


  async function writeDailySpecial() {
    const docData = {...heartRate}
    
    try{
        await setDoc(specialOfTheDay, docData, {merge: true});
        let dbDate = new Date().toISOString()
        console.log(`The doc has been written on ${dbDate}`)
      } catch(error) {
        console.log(`I got an error ${error}`)
    }
}

let task = cron.schedule('*/2 * * * *', getEpochVal)
task.start()

// setTimeout(() => {
//   console.log(`Global value of today is : ${today} and Global value of tom is : ${tomorrow}`)
// }, 50000)
