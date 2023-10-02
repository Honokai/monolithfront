import axios from 'axios'

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APIURL,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json;charset=utf-8",
    "Access-Control-Allow-Methods":"GET,PUT,POST,DELETE,PATCH,OPTIONS",
  }
})