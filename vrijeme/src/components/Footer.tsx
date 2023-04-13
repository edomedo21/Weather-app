import React, { useEffect, useState } from 'react'
import { WeatherData } from './Vrijeme'

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY

const Footer = () => {
    const cities = ['Cazin', 'Bihać', 'Sarajevo'];

const [podaci, setPodaci] = useState<WeatherData[]>([]);

useEffect(() => {
  const fetchData = async () => {
    const responses = await Promise.all(cities.map(city => 
      fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`)
    ));
    const data = await Promise.all(responses.map(response => response.json()));
    setPodaci(data);
  };
  fetchData();
}, []);
  return (
   <div className="navbar bg-neutral text-neutral-content mt-1">
  <div className='px-10'>
    <p className="normal-case text-xl mr-2">{podaci[0]?.location.name}</p>
    <p className="normal-case text-xl"> {podaci[0]?.current.temp_c}°</p>
    <img src={podaci[0]?.current.condition.icon} />
  </div>
  <div className='m-auto'>
    <p className="normal-case text-xl mr-2">{podaci[1]?.location.name}</p>
    <p className="normal-case text-xl"> {podaci[1]?.current.temp_c}°</p>
    <img src={podaci[1]?.current.condition.icon} />
  </div>
  <div className='flex justify-end mr-[20px]'>
    <p className="normal-case text-xl mr-2">{podaci[2]?.location.name}</p>
    <p className="normal-case text-xl"> {podaci[2]?.current.temp_c}°</p>
    <img src={podaci[2]?.current.condition.icon} />
  </div>
</div>
  )
}



export default Footer