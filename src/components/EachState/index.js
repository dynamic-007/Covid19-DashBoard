import {useState, useEffect} from 'react'
import Header from '../Header'
import Footer from '../Footer'
import LoaderSpinner from '../LoaderSpinner'
import DailyTrend from '../DailyTrend'

import './index.css'

const statesList = [
  {
    state_code: 'AN',
    state_name: 'Andaman and Nicobar Islands',
  },
  {
    state_code: 'AP',
    state_name: 'Andhra Pradesh',
  },
  {
    state_code: 'AR',
    state_name: 'Arunachal Pradesh',
  },
  {
    state_code: 'AS',
    state_name: 'Assam',
  },
  {
    state_code: 'BR',
    state_name: 'Bihar',
  },
  {
    state_code: 'CH',
    state_name: 'Chandigarh',
  },
  {
    state_code: 'CT',
    state_name: 'Chhattisgarh',
  },
  {
    state_code: 'DN',
    state_name: 'Dadra and Nagar Haveli and Daman and Diu',
  },
  {
    state_code: 'DL',
    state_name: 'Delhi',
  },
  {
    state_code: 'GA',
    state_name: 'Goa',
  },
  {
    state_code: 'GJ',
    state_name: 'Gujarat',
  },
  {
    state_code: 'HR',
    state_name: 'Haryana',
  },
  {
    state_code: 'HP',
    state_name: 'Himachal Pradesh',
  },
  {
    state_code: 'JK',
    state_name: 'Jammu and Kashmir',
  },
  {
    state_code: 'JH',
    state_name: 'Jharkhand',
  },
  {
    state_code: 'KA',
    state_name: 'Karnataka',
  },
  {
    state_code: 'KL',
    state_name: 'Kerala',
  },
  {
    state_code: 'LA',
    state_name: 'Ladakh',
  },
  {
    state_code: 'LD',
    state_name: 'Lakshadweep',
  },
  {
    state_code: 'MH',
    state_name: 'Maharashtra',
  },
  {
    state_code: 'MP',
    state_name: 'Madhya Pradesh',
  },
  {
    state_code: 'MN',
    state_name: 'Manipur',
  },
  {
    state_code: 'ML',
    state_name: 'Meghalaya',
  },
  {
    state_code: 'MZ',
    state_name: 'Mizoram',
  },
  {
    state_code: 'NL',
    state_name: 'Nagaland',
  },
  {
    state_code: 'OR',
    state_name: 'Odisha',
  },
  {
    state_code: 'PY',
    state_name: 'Puducherry',
  },
  {
    state_code: 'PB',
    state_name: 'Punjab',
  },
  {
    state_code: 'RJ',
    state_name: 'Rajasthan',
  },
  {
    state_code: 'SK',
    state_name: 'Sikkim',
  },
  {
    state_code: 'TN',
    state_name: 'Tamil Nadu',
  },
  {
    state_code: 'TG',
    state_name: 'Telangana',
  },
  {
    state_code: 'TR',
    state_name: 'Tripura',
  },
  {
    state_code: 'UP',
    state_name: 'Uttar Pradesh',
  },
  {
    state_code: 'UT',
    state_name: 'Uttarakhand',
  },
  {
    state_code: 'WB',
    state_name: 'West Bengal',
  },
]

const EachState = props => {
  const {match} = props
  const {params} = match
  const {stateCode} = params

  const [details, setDetail] = useState({
    name: '',
    stateData: {},
    isLoading: true,
    districts: [],
    tag: 'confirmed',
  })
  const color = () => {
    if (details.tag === 'active') {
      return '#0A4FA0'
    }
    if (details.tag === 'recovered') {
      return '#216837'
    }
    if (details.tag === 'deceased') {
      return '#474C57'
    }
    return '#9A0E31'
  }
  const getStatedetails = async () => {
    const url = 'https://apis.ccbp.in/covid19-state-wise-data'

    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()

      const sname = statesList.filter(each => each.state_code === stateCode)
      console.log(sname[0])
      const dis = Object.entries(data[stateCode].districts)
      const dis1 = dis.map(each => ({
        dname: each[0],
        confirmed:
          each[1].total.confirmed === undefined ? 0 : each[1].total.confirmed,
        recovered:
          each[1].total.recovered === undefined ? 0 : each[1].total.recovered,
        deceased:
          each[1].total.deceased === undefined ? 0 : each[1].total.deceased,
      }))
      const dis2 = dis1.map(each => ({
        ...each,
        active: each.confirmed - (each.recovered + each.deceased),
      }))
      dis2.sort((a, b) => b[details.tag] - a[details.tag])
      setDetail({
        ...details,
        name: sname[0].state_name,
        stateData: data[stateCode],
        districts: dis2,
        isLoading: false,
      })
    }
  }

  const changeTag = val => {
    setDetail({...details, tag: val})
  }

  useEffect(() => {
    getStatedetails()
  }, [])

  return (
    <>
      <Header />
      <div className="home-container">
        {details.isLoading === true && (
          <div data-testid="stateDetailsLoader">
            <LoaderSpinner />
          </div>
        )}
        {details.isLoading === false && (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '80%',
              }}
            >
              <div>
                <div className="sname-d">
                  <div className="dummy">
                    <h1 className="sname-h">{details.name}</h1>
                  </div>
                </div>
                <p className="lst">
                  last updated on {details.stateData.meta.last_updated}
                </p>
              </div>
              <div>
                <p className="dlisttext">Tested</p>
                <p className="dlistnumber">{details.stateData.total.tested}</p>
              </div>
            </div>
            <div className="stats-container">
              <ul style={{listStyleType: 'none', display: 'flex'}}>
                <li key="confirmed" onClick={() => changeTag('confirmed')}>
                  <div
                    className="confirmed card"
                    data-testid="stateSpecificConfirmedCasesContainer"
                    style={
                      details.tag === 'confirmed'
                        ? {backgroundColor: '#331427'}
                        : {}
                    }
                  >
                    <p className="stats-type confirmed-cases">Confirmed</p>
                    <img
                      src="https://res.cloudinary.com/dvmp5vgbm/image/upload/v1654438432/Covid19%20Dashboard/check-mark_1_odg0vn.png"
                      alt="state specific confirmed cases pic"
                    />
                    <p className="confirmed-cases cases">
                      {details.stateData.total.confirmed}
                    </p>
                  </div>
                </li>
                <li key="active" onClick={() => changeTag('active')}>
                  <div
                    className="active card"
                    style={
                      details.tag === 'active'
                        ? {backgroundColor: '#132240'}
                        : {}
                    }
                  >
                    <p
                      className="stats-type active-cases"
                      data-testid="stateSpecificActiveCasesContainer"
                    >
                      Active
                    </p>
                    <img
                      src="https://res.cloudinary.com/dvmp5vgbm/image/upload/v1654438417/Covid19%20Dashboard/protection_1_zjqmhw.png"
                      alt="state specific active cases pic"
                    />
                    <p className="active-cases cases">
                      {details.stateData.total.confirmed -
                        (details.stateData.total.recovered +
                          details.stateData.total.deceased)}
                    </p>
                  </div>
                </li>
                <li key="recovered" onClick={() => changeTag('recovered')}>
                  <div
                    className="recovered card"
                    style={
                      details.tag === 'recovered'
                        ? {backgroundColor: '#182829'}
                        : {}
                    }
                  >
                    <p
                      className="stats-type recovered-cases"
                      data-testid="stateSpecificRecoveredCasesContainer"
                    >
                      Recovered
                    </p>
                    <img
                      src="https://res.cloudinary.com/dvmp5vgbm/image/upload/v1654438418/Covid19%20Dashboard/recovered_1_qmgv0f.png"
                      alt="state specific recovered cases pic"
                    />
                    <p className="recovered-cases cases">
                      {details.stateData.total.recovered}
                    </p>
                  </div>
                </li>
                <li key="deceased" onClick={() => changeTag('deceased')}>
                  {' '}
                  <div
                    className="deceased card"
                    style={
                      details.tag === 'deceased'
                        ? {backgroundColor: '#212230'}
                        : {}
                    }
                  >
                    <p
                      className="stats-type deceased-cases"
                      data-testid="stateSpecificDeceasedCasesContainer"
                    >
                      Deceased
                    </p>
                    <img
                      src="https://res.cloudinary.com/dvmp5vgbm/image/upload/v1654438420/Covid19%20Dashboard/breathing_1_ctu4mw.png"
                      alt="state specific deceased cases pic"
                    />
                    <p className="deceased-cases cases">
                      {details.stateData.total.deceased}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div data-testid="lineChartsContainer">
              <div>
                <h1 className="tophead" style={{color: color()}}>
                  Top Districts
                </h1>
                <ul data-testid="topDistrictsUnorderedList" className="dl">
                  {details.districts.map(each => (
                    <li className="dlist" key={each.dname}>
                      <p className="dlistnumber">{each[details.tag]}</p>
                      <p className="dlisttext">{each.dname}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <DailyTrend stateCode={stateCode} tag={details.tag} />
            </div>
          </>
        )}
        <Footer />
      </div>
    </>
  )
}

export default EachState
