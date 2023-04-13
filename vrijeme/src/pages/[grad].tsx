import NavigacioniBar from '@/components/NavigacioniBar';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {BiChevronLeft} from 'react-icons/bi';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export interface PodaciPrognoze {
    location: {
        country: string;
    }
    current: {
        temp_c: number;
        condition: {
          text: string;
          code: number;
          icon: string;
        };
    }
    forecast: {
        forecastday: {
            date: string;
            day: {
                maxtemp_c: number;
                mintemp_c: number;
                daily_chance_of_rain: number;
                condition: {
                    text: string;
                    icon: string;
                    code: number;
                }
            }
        }[]
    }
}

function Grad() {
  const router = useRouter();
  const { grad } = router.query;

  function handleClick(){
    router.push('/');
  }

  const [podaci, setPodaci] = useState<PodaciPrognoze>();

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${grad}&days=5`);
            const data = await response.json();
            setPodaci(data);
            console.log(data);
        };
        fetchData();
    }, []);

  return (
    <div>
        <NavigacioniBar />
        <div className='bg-prognoza bg-cover h-screen bg-transparent'>
      <div className='w-screen px-14 flex flex-row text-white font-bold'>
        <BiChevronLeft className='text-4xl mt-5 hover:cursor-pointer' onClick={handleClick}/>
        <h2 className='px-5 text-2xl mt-5'>{podaci?.location?.country} | {grad}</h2>
        </div>
      <p className='px-28'>Detalji vremena za narednih 5 dana</p>
      <div className='w-screen h-[250px] flex flex-row mb-5 mx-auto'>
            <div className='px-28 mt-12 flex flex-col justify-start'>
                <div className=''>
                <p className='text-6xl font-bold text-white'>{Math.round(podaci?.current?.temp_c ?? 0)}°</p>
                <p className=''>{podaci?.current?.condition.text}</p>
                <p>Vjerovatnoća za kišu: {podaci?.forecast?.forecastday[0].day.daily_chance_of_rain}%</p>
                <img width='80px' src={podaci?.current?.condition.icon} />
                </div>
            </div>

            {podaci?.forecast?.forecastday.slice(0, 5).map((forecast, index) => (
            <div key={index} className={`mt-12 flex flex-col items-center ${index !== 0 ? 'ml-12' : ''}`}>
            <p className='text-xl text-white'>{forecast.date}</p>
            <img width='60px' src={forecast.day.condition?.icon} />
            <p className='text-xl text-white'>{Math.round(forecast.day.mintemp_c ?? 0)}°/{Math.round(forecast.day.maxtemp_c ?? 0)}°</p>
            <p className='mt-2'>{forecast.day.condition?.text}</p>
            <p>Kiša: {forecast.day.daily_chance_of_rain}%</p>
  </div>
))}

        </div>
        </div>
    </div>
  );
}

export default Grad;