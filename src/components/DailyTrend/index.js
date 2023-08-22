import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'

import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  BarChart,
  Bar,
} from 'recharts'

import './index.css'

const DailyTrend = props => {
  const {stateCode, tag} = props
  const [gdata, setGraph] = useState({
    graphData: [],
    bargraph: [],
    isLoading: true,
  })

  const fillcolor = () => {
    if (tag === 'confirmed') {
      return '#9A0E31'
    }
    if (tag === 'active') {
      return '#0A4FA0'
    }
    if (tag === 'recovered') {
      return '#216837'
    }
    return '#474C57'
  }

  const convertMsToDays = ms => {
    const msInOneSecond = 1000
    const secondsInOneMinute = 60
    const minutesInOneHour = 60
    const hoursInOneDay = 24

    const minutesInOneDay = hoursInOneDay * minutesInOneHour
    const secondsInOneDay = secondsInOneMinute * minutesInOneDay
    const msInOneDay = msInOneSecond * secondsInOneDay

    return Math.ceil(ms / msInOneDay)
  }

  const getDaysBetweenDates = (dateOne, dateTwo) => {
    let differenceInMs = dateTwo.getTime() - dateOne.getTime()

    if (differenceInMs < 0) {
      differenceInMs = dateOne.getTime() - dateTwo.getTime()
    }

    return convertMsToDays(differenceInMs)
  }

  const title = tag.charAt(0).toUpperCase() + tag.slice(1)
  const getState = async () => {
    const res = await fetch(
      `https://apis.ccbp.in/covid19-timelines-data/${stateCode}`,
      {
        method: 'GET',
      },
    )
    const data = await res.json()
    if (res.ok === true) {
      const arrayData = Object.entries(data[stateCode].dates)

      const graphData = arrayData.map(each => ({
        date: each[0],
        confirmed: each[1].total.confirmed,
        recovered: each[1].total.recovered,
        deceased: each[1].total.deceased,
        active:
          each[1].total.confirmed -
          (each[1].total.recovered + each[1].total.deceased),
        tested: each[1].total.tested,
      }))

      const bargraph = graphData.filter(each => {
        if (
          getDaysBetweenDates(new Date('2021-09-10'), new Date(each.date)) <= 10
        ) {
          return each
        }
        return null
      })

      setGraph({graphData, bargraph, isLoading: false})
    }
  }

  useEffect(() => {
    getState()
  }, [])
  return gdata.isLoading ? (
    <div data-testid="timelinesDataLoader">
      <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
    </div>
  ) : (
    <div className="graph-container">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1 className="daily">Statistics About {title} Cases</h1>
        <BarChart width={730} height={250} data={gdata.bargraph}>
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="date" />
          <Tooltip />
          <Bar dataKey={`${tag}`} fill={`${fillcolor()}`} />
        </BarChart>
      </div>
      <div>
        <h1 className="daily">Daily Spread Trends</h1>
      </div>
      <div className="graph confirmed1">
        <LineChart
          width={730}
          height={250}
          data={gdata.graphData}
          margin={{top: 5, right: 30, left: 20, bottom: 5}}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend legendType="none" />
          <Line
            type="monotone"
            dataKey="confirmed"
            stroke="#FF073A"
            fill="#FF073A"
            activeDot={{stroke: 'red', strokeWidth: 2, r: 10}}
            strokeWidth={3}
          />
        </LineChart>
      </div>
      <div className="graph active1">
        <LineChart
          width={730}
          height={250}
          data={gdata.graphData}
          margin={{top: 5, right: 30, left: 20, bottom: 5}}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="active"
            stroke="#007BFF"
            fill="#007BFF"
            activeDot={{stroke: 'red', strokeWidth: 2, r: 10}}
            strokeWidth={3}
          />
        </LineChart>
      </div>
      <div className="graph recovered1">
        <LineChart
          width={730}
          height={250}
          data={gdata.graphData}
          margin={{top: 5, right: 30, left: 20, bottom: 5}}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="recovered"
            stroke="#27A243"
            fill="#27A243"
            activeDot={{stroke: 'red', strokeWidth: 2, r: 10}}
            strokeWidth={3}
          />
        </LineChart>
      </div>
      <div className="graph deceased1">
        <LineChart
          width={730}
          height={250}
          data={gdata.graphData}
          margin={{top: 5, right: 30, left: 20, bottom: 5}}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="deceased"
            stroke="#6C757D"
            fill="#6C757D"
            activeDot={{stroke: 'red', strokeWidth: 2, r: 10}}
            strokeWidth={3}
          />
        </LineChart>
      </div>
      <div className="graph tested1">
        <LineChart
          width={730}
          height={250}
          data={gdata.graphData}
          margin={{top: 5, right: 30, left: 20, bottom: 5}}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="tested"
            stroke="#9673B9"
            fill="#9673B9"
            activeDot={{stroke: 'red', strokeWidth: 2, r: 10}}
            strokeWidth={3}
          />
        </LineChart>
      </div>
    </div>
  )
}
export default DailyTrend
