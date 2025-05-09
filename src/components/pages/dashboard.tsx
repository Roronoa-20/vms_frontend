import React from 'react'
import DashboardCardCounter from '../molecules/Dashboard-Card-Count'
import DashboardTable from '../molecules/Dashboard-Table'

const Dashboard = () => {
  return (
    <div className='p-8'>
        {/* Cards */}
        <DashboardCardCounter/>
        <DashboardTable/>
    </div>
  )
}

export default Dashboard