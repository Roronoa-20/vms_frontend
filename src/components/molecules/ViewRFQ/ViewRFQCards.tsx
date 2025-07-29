import { Database, TrendingUp } from 'lucide-react'
import React from 'react'

const ViewRFQCards = () => {
    return (
        <div className='mt-4'>
             <h1 className='text-lg py-2 font-semibold'>Bidding Counts</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total RFQ Sent</p>
                            <p className="text-3xl font-bold text-gray-900">{9876}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Database className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Quatation Submitted</p>
                            <p className="text-3xl font-bold text-green-600">{876}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewRFQCards
