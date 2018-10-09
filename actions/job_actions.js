import axios from 'axios';
import qs from 'qs';
import Geocoder from 'react-native-geocoding';

import { FETCH_JOBS, LIKE_JOB, CLEAR_LIKED_JOBS } from './types';

const JOB_ROOT_URL = 'https://jobs.github.com/positions.json?';

const JOB_QUERY_PARAMS = {

};

const buildJobsLocation = (region) => {
  Geocoder.init('AIzaSyDPJjqOPDX5lqKaPGzP1PQXS3muyO7OyJY');
  const { latitude, longitude } = region;
  const lat = parseFloat(latitude).toFixed(2);
  const long = parseFloat(longitude).toFixed(2);
  return Geocoder.getFromLatLng(lat, long).then(
    json => {
      let addressComponent = json.results[0].address_components[3]; 
      return addressComponent.long_name; 
    },
    error => {
      console.log(error);
    }
  );
};

const buildJobsUrl = (region, postalTown) => {
  const { latitude, longitude } = region;
  let query;
  if (!postalTown) {
  query = qs.stringify({ ...JOB_QUERY_PARAMS, lat: latitude, long: longitude });
  } else {
  query = qs.stringify({ ...JOB_QUERY_PARAMS, location: postalTown });
  }
  return `${JOB_ROOT_URL}${query}`;
};

const getJobsLonLat = jobs => {
  return jobs.map(job => {
    return Geocoder.getFromLocation(job.location).then(
      json => {
        const tempJob = {
          ...job, 
          longitude: json.results[0].geometry.location.lng, 
          latitude: json.results[0].geometry.location.lat 
        };
        return tempJob;
      },
    error => {
      console.log(error);
    });
  });
};

export const fetchJobs = (region, callback) => async dispatch => {
  try {
    const postalTown = await buildJobsLocation(region);
    const url = buildJobsUrl(region, postalTown);
    let response = await axios.get(url);
    let promise = getJobsLonLat(response.data);
    Promise.all(promise).then(results => {
      dispatch({ type: FETCH_JOBS, payload: results });
      callback();
    });
  } catch (err) {
    console.error(err);
  }
};

export const likeJob = (job) => {
  return {
    payload: job,
    type: LIKE_JOB
  };
};

export const clearLikedJobs = () => {
  return {
    type: CLEAR_LIKED_JOBS
  };
};
