import { Award, HeartHandshake, Users } from 'lucide-react'
import React from 'react'

const Middleintro = () => {
  return (
     <section id='#about' className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Why Use Our Blood Network?</h2>
            <p className="text-gray-500 mt-2">Connecting patients, donors, and hospitals efficiently.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 rounded-2xl border border-gray-100 text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-gray-800">Verified Donors</h3>
              <p className="text-sm text-gray-600">All member profiles and blood groups are authenticated for quick response times.</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-gray-100 text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-gray-800">Instant Matching</h3>
              <p className="text-sm text-gray-600">Real-time geo-location notifications to donors whenever a compatible request is made nearby.</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-gray-100 text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-gray-800">Badges & Impact</h3>
              <p className="text-sm text-gray-600">Track your life-saving donations, earn community badges, and monitor your personal impact.</p>
            </div>
          </div>
        </div>
      </section>
  )
}

export default Middleintro
