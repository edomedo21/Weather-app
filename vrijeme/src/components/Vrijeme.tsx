import { SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;


export interface WeatherData {
  location: {
    name: string;
    localtime: string;
    country: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      code: number;
      icon: string;
    };
    wind_kph: number;
    feelslike_c: number;
    humidity: number;
    pressure_mb: number;
    uv: number;
    cloud: number;
    gust_kph: number;
  };
}

export function Weather (){
  const router = useRouter();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [potrazi, setPotrazi] = useState('');
  const [barHeight, setBarHeight] = useState('0%'); // Define a state variable for the bar height
  const [UVindex, setUVindex] = useState('');
  const [BgImage, setBgImage] = useState('');
  const [Tekst, setTekst] = useState('');

  function handleClick() {
    router.push(potrazi);
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${potrazi}`);
      const data = await response.json();
      setWeatherData(data);
      console.log(data);
      const temperature = data?.current?.temp_c;
      const kodVremena = data?.current?.condition.code;

      console.log(kodVremena);

      if(kodVremena==1000){
        setBgImage('bg-sunce');
        setTekst('Sunčano, Čisto');
      }
      else if(kodVremena >=1003 && kodVremena <=1030){
        setBgImage('bg-oblacno');
        setTekst('Oblačno');
      }
      else if(kodVremena >=1063 && kodVremena <=1201){
        setBgImage('bg-kisa');
        setTekst('Kiša');
      }
      else if(kodVremena >=1204){
        setBgImage('bg-snijeg');
        setTekst('Snijeg');
      }
      else {
        setBgImage('');
      }
      
      if (temperature !== undefined) {
        const percentage = ((temperature - (-10)) / (50 - (-10))) * 100; // Calculate the percentage of the bar height based on temperature
        setBarHeight(`${percentage}%`); // Update the state variable for the bar height
        console.log(percentage);
      }
      const indeks = data?.current?.uv;

      if(indeks !==undefined && indeks < 3 ){
        setUVindex(`Nisko`);
      }
      else if (indeks !==undefined && indeks>=3 && indeks < 8){
        setUVindex(`Umjereno`);
      }
      else if (indeks >=8){
        setUVindex(`Visoko`);
      }


    };

    if(potrazi) {
      fetchData();
    }
  },[potrazi]);

  return (
    <div className='flex flex-row h-[530px] w-full '>
  <div className={`w-3/5 flex flex-col gap-2 px-28 bg-cover text-white ${BgImage}`}>
    {weatherData ? (
      <div className='mt-28'>
        <div className="bg-gray-200 w-10 h-40 rounded-full relative overflow-hidden mt-2">
          <div className={`bg-red-500 absolute bottom-0 left-0 right-0 transform origin-bottom transition-all duration-500 ease-in-out`} style={{ height: barHeight }}></div>
          <div className="border-t-0 border border-gray-400 w-2/3 h-full mx-auto rounded-full"></div>
        </div>
        <div className='flex flex-row gap-2 mb-32 mt-20'>
        <p className='text-6xl font-bold'>{Math.round(weatherData?.current?.temp_c)}°</p>
          <div className='flex flex-col'>
          <p className='text-xl'>{weatherData?.location?.name}</p>
          <p className='text-xl'>{weatherData?.location?.localtime.split(' ')[1]} - {weatherData?.location?.country}</p>
          </div>
          <div className='flex flex-col px-5'>
             <img src={weatherData?.current?.condition.icon} width='28px'/>
          <p className='text-xl'>{Tekst}</p>
          </div>
        </div>

      </div>
    ) : (
      <div className='flex flex-col items-center mt-20'>
        Unesite Naziv Grada za Prikaz Podataka o Vremenu...</div>
    )}
  </div>
  <div className='w-2/5'>
  <div className='flex items-center mt-5 justify-center'> 
  <div className="indicator">
  <span className="indicator-item badge">Obavezno</span>
  <input type="text" value={potrazi} onChange={(e) => setPotrazi(e.currentTarget.value)} placeholder="Unesite Grad" className="input input-bordered" />
</div>
    </div>
    <hr className='ml-5 mt-5 mr-5 border-gray-600'/>
    <div className='flex items-center justify-center mt-5 text-white'>
      <h2>Detalji o Vremenu</h2>
    </div>
    <div className='mt-5 px-5 flex flex-row'>
      <div className='w-2/3 justify-start'>
        <p className='mb-4'>Temperatura</p>
        <p className='mb-4'>Osjeća se kao</p>
        <p className='mb-4'>Vrijeme</p>
        <p className='mb-4'>Vlažnost</p>
        <p className='mb-4'>Pritisak</p>
        <p className='mb-4'>UV Indeks</p>
        <p className='mb-4'>Prikrivenost oblacima</p>
        <p className='mb-4'>Brzina vjetra</p>
        <p className='mb-4'>Pogledajte prognozu za narednih 5 dana</p>
      </div>
      <div className='w-1/3'>
        <p className='mb-4'><span className='text-white'>{weatherData?.current?.temp_c}</span> °C</p>
        <p className='mb-4'><span className='text-white'>{weatherData?.current?.feelslike_c}</span> °C</p>
        <p className='mb-4'><span className='text-white'>{Tekst}</span></p>
        <p className='mb-4'><span className='text-white'>{weatherData?.current?.humidity}</span> %</p>
        <p className='mb-4'><span className='text-white'>{weatherData?.current?.pressure_mb}</span> HaPa</p>
        <p className='mb-4'><span className='text-white'>{weatherData?.current?.uv}</span> ({UVindex})</p>
        <p className='mb-4'><span className='text-white'>{weatherData?.current?.cloud}</span> %</p>
        <p className='mb-4'><span className='text-white'>{weatherData?.current?.wind_kph}</span> km/h</p>
        <button className="btn btn-active btn-secondary text-white" onClick={handleClick}>Pogledaj</button>
      </div>
    </div>
  </div>
</div>    
  );
}

export default Weather;
